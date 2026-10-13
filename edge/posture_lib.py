"""Fonctions communes du POC edge : caméra, MoveNet, angles, règles de posture.

Utilisé par poc.py (la vraie session), live.py (debug) et les scripts de tests_poc/.
Aucune image n'est jamais écrite : elles n'existent qu'en mémoire.
"""

import math
import subprocess
import time
from collections import Counter, deque
from datetime import datetime
from pathlib import Path

import cv2
import numpy as np
from ai_edge_litert.interpreter import Interpreter

DOSSIER_EDGE = Path(__file__).resolve().parent
# Thunder plutôt que Lightning : mesuré le 12/10/2026 (T4), tête 2,9° d'écart-type au lieu de 4,9°,
# hanche bien mieux vue (confiance 0,62 au lieu de 0,34), pour 70 ms par image au lieu de 27 ms.
MODELE_PAR_DEFAUT = DOSSIER_EDGE / "models" / "movenet_thunder_int8.tflite"
DOSSIER_RESULTATS = DOSSIER_EDGE / "resultats"

# En dessous, un point est jugé mal détecté. 0,20 et non 0,30 : de profil, l'oreille et l'épaule
# sont souvent vues entre 0,20 et 0,30 ; mesuré le 08/10/2026 (331 images), le seuil de 0,30 rejetait
# 20 % des images alors que leurs angles étaient les mêmes que les autres (99 % exploitables à 0,20).
CONF_MIN = 0.2
ECART_EPAULES_MAX = 0.35   # écart des 2 épaules ÷ tronc ; au-delà, la personne n'est pas de profil

# Seuils fixes, sans calibration. T5 du 12/10/2026, 4 volontaires : « tête < 50° ou tronc > 20° »
# repère la personne penchée vers l'écran (F1 0,82, 97 % d'alertes justes) ; la cause annoncée
# (dos penché si tronc > 20°, sinon tête en avant) est juste 66 à 85 % du temps, car tête et buste
# avancent souvent ensemble. Calibration écartée : chacun calibrait calé au dossier puis se
# redressait, et des écarts serrés à cette référence sonnaient à tort. « Allongé » = avachi
# prononcé seulement : à −30°, 0,8 % de fausses alertes, alors qu'un avachi léger (−20°)
# se confond avec « calé au dossier » (12 % de fausses alertes). « Cou penché » (regarder son
# téléphone) : le nez plonge sous l'oreille (+51° et +58° chez 2 personnes le 12/10, contre +5 à +33°
# en bonne posture et +13 à +43° tête en avant). 42° et non 45° : téléphone tenu plus haut (nez à +41–53°)
# vu à 91 % au lieu de 64 %, pour 0 à 4 % des images de bonne posture (essais du 12/10).
SEUILS = {"tete": 50, "tronc": 20, "allonge": -30, "cou": 42}

# Calibration : médiane des angles pendant les 2 premières minutes de travail normal. Écartée des
# alertes (voir SEUILS) et du score (% du temps en bonne posture, algo-posture.md §7.4) : ne sert plus
# qu'aux outils de mesure (live.py, enregistrer.py). Mesuré le 12/10/2026 : 10 s « tenez-vous droit »
# donnaient une référence jouée, trop haute ou trop basse.
DUREE_CALIBRATION = 120

# Numéros MoveNet des points utiles, par côté : oreille, épaule, hanche
COTES = {"gauche": (3, 5, 11), "droite": (4, 6, 12)}

# Paires de points reliées pour dessiner le squelette
SQUELETTE = [
    (0, 1), (0, 2), (1, 3), (2, 4),            # visage : nez, yeux, oreilles
    (5, 6), (5, 7), (7, 9), (6, 8), (8, 10),   # épaules, bras
    (5, 11), (6, 12), (11, 12),                # tronc
    (11, 13), (13, 15), (12, 14), (14, 16),    # jambes
]


# ---------- Caméra ----------

def ouvrir_camera(numero=0, largeur=640, hauteur=480):
    cam = cv2.VideoCapture(numero, cv2.CAP_V4L2)
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, largeur)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, hauteur)
    # Par défaut la webcam garde 4 images en réserve : après quelques secondes sans
    # lecture, elles sont périmées. Avec une réserve de 1, capturer() n'en jette qu'une.
    cam.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    return cam


def capturer(cam):
    """Renvoie une image fraîche (en mémoire uniquement), ou None si la capture échoue."""
    cam.grab()                            # jette l'image en réserve, prise lors de la capture précédente
    ok, image = cam.read()                # attend une image fraîche
    # copy() : OpenCV peut réutiliser la même zone mémoire d'une capture à l'autre ; sans copie,
    # ce qu'on dessine sur l'image (textes de live.py) se retrouvait sur les images suivantes.
    return image.copy() if ok else None


# ---------- MoveNet ----------

class MoveNet:
    def __init__(self, chemin=MODELE_PAR_DEFAUT, threads=4):
        self.modele = Interpreter(model_path=str(chemin), num_threads=threads)
        self.modele.allocate_tensors()
        self.entree = self.modele.get_input_details()[0]
        self.sortie = self.modele.get_output_details()[0]
        self.taille = int(self.entree["shape"][1])         # 192 (Lightning) ou 256 (Thunder)

    def points(self, image_bgr):
        """Renvoie 17 points (x, y en pixels, confiance entre 0 et 1)."""
        h, w = image_bgr.shape[:2]
        cote = max(h, w)                                   # on complète en carré
        carre = np.zeros((cote, cote, 3), dtype=np.uint8)  # pour ne pas déformer
        haut, gauche = (cote - h) // 2, (cote - w) // 2    # la personne
        carre[haut:haut + h, gauche:gauche + w] = image_bgr
        rgb = cv2.cvtColor(carre, cv2.COLOR_BGR2RGB)
        x = cv2.resize(rgb, (self.taille, self.taille))[np.newaxis].astype(self.entree["dtype"])
        self.modele.set_tensor(self.entree["index"], x)
        self.modele.invoke()
        res = self.modele.get_tensor(self.sortie["index"])[0, 0]   # 17 × (y, x, score)
        pts = np.empty((17, 3), dtype=np.float32)
        pts[:, 0] = res[:, 1] * cote - gauche              # x en pixels
        pts[:, 1] = res[:, 0] * cote - haut                # y en pixels
        pts[:, 2] = res[:, 2]                              # confiance
        return pts


# ---------- Angles et règles ----------

def cote_vu(pts):
    """Côté (gauche / droite) dont l'oreille, l'épaule et la hanche sont les mieux vues."""
    return max(COTES, key=lambda c: pts[list(COTES[c]), 2].mean())


class CoteStable:
    """Choisit le côté vu (gauche / droite) sans le faire basculer à chaque image.

    De profil, MoveNet devine les points du côté caché et leur donne parfois une confiance presque
    aussi haute que ceux du côté visible : le meilleur côté changeait d'une image à l'autre et les
    angles sautaient. La caméra ne bouge pas pendant une session, donc on garde le côté choisi et on
    ne change que si l'autre est nettement meilleur pendant plusieurs images d'affilée.
    """

    MARGE = 0.15         # confiance moyenne d'avance nécessaire pour envisager de changer
    IMAGES = 5           # nombre d'images d'affilée où l'autre côté doit être nettement meilleur

    def __init__(self):
        self.cote = None
        self.compteur = 0

    def maj(self, pts):
        conf = {c: float(pts[list(COTES[c]), 2].mean()) for c in COTES}
        if self.cote is None:
            self.cote = max(conf, key=conf.get)
            return self.cote
        autre = "droite" if self.cote == "gauche" else "gauche"
        self.compteur = self.compteur + 1 if conf[autre] > conf[self.cote] + self.MARGE else 0
        if self.compteur >= self.IMAGES:
            self.cote, self.compteur = autre, 0
        return self.cote


class Completeur:
    """Remplace UN point mal vu (oreille, épaule ou hanche) par sa dernière position fiable.

    Plutôt que d'ignorer l'image pour un trou court (bras qui passe devant, confiance qui chute
    une image), on reprend la position vue juste avant. Seulement si un seul des 3 points manque
    et qu'il a été bien vu il y a au plus DUREE_MAX secondes : au-delà, l'image reste ignorée,
    on n'invente pas une posture. Le contrôle « de profil » s'applique ensuite normalement.
    """

    # s : ~12 images à 5 img/s (live.py), 1 image à la cadence « doute » de poc.py. 2,5 et non 2,0 :
    # deux images à 2 s d'écart sont séparées de 2,0 s plus le temps variable de la capture, donc
    # souvent un peu plus de 2,0 s, et la reprise échouait une fois sur deux.
    DUREE_MAX = 2.5
    NOMS = ("oreille", "epaule", "hanche")

    def __init__(self):
        self.derniers = {}   # numéro MoveNet → (x, y, instant de la dernière vue fiable)

    def maj(self, pts, cote, instant=None):
        """Renvoie (points éventuellement complétés, nom du point complété ou None)."""
        instant = time.monotonic() if instant is None else instant
        indices = COTES[cote]
        for i in indices:
            if pts[i, 2] >= CONF_MIN:
                self.derniers[i] = (pts[i, 0], pts[i, 1], instant)
        mal_vus = [i for i in indices if pts[i, 2] < CONF_MIN]
        if len(mal_vus) != 1:
            return pts, None
        i = mal_vus[0]
        dernier = self.derniers.get(i)
        if dernier is None or instant - dernier[2] > self.DUREE_MAX:
            return pts, None
        pts = pts.copy()
        pts[i] = (dernier[0], dernier[1], CONF_MIN)
        return pts, self.NOMS[indices.index(i)]


def ecart_epaules(pts, cote=None):
    """Écart horizontal entre les deux épaules ÷ longueur du tronc : ≈ 0 de profil, ≈ 0,8 de face.

    None si non mesurable : de profil, l'épaule côté mur est souvent cachée, et c'est normal.
    cote : côté à utiliser (voir CoteStable) ; par défaut, le mieux vu sur cette image.
    """
    _, e, h = COTES[cote or cote_vu(pts)]
    if min(pts[5, 2], pts[6, 2], pts[h, 2]) < CONF_MIN:
        return None
    longueur_tronc = float(np.linalg.norm(pts[e, :2] - pts[h, :2]))
    if longueur_tronc <= 0:
        return None
    return abs(float(pts[5, 0] - pts[6, 0])) / longueur_tronc


def angle_cou(pts, cote):
    """Angle de la droite oreille → nez sous l'horizontale (None si le nez est mal vu).

    Grandit quand on regarde vers le bas (téléphone) ; bouge peu quand la tête avance.
    """
    o = COTES[cote][0]
    if min(pts[0, 2], pts[o, 2]) < CONF_MIN:
        return None
    return math.degrees(math.atan2(pts[0, 1] - pts[o, 1], abs(pts[0, 0] - pts[o, 0])))


def angles(pts, cote=None):
    """Angles de la tête et du tronc (§5.3). None si points peu fiables.

    cote : côté à utiliser (voir CoteStable) ; par défaut, le mieux vu sur cette image.
    """
    cote = cote or cote_vu(pts)
    o, e, h = COTES[cote]
    if min(pts[o, 2], pts[e, 2], pts[h, 2]) < CONF_MIN:
        return None                                    # capture ignorée (UNKNOWN)
    ecart = ecart_epaules(pts, cote)
    if ecart is not None and ecart > ECART_EPAULES_MAX:
        return None                                    # pas de profil : angles faux (UNKNOWN)
    oreille, epaule, hanche = pts[o, :2], pts[e, :2], pts[h, :2]

    # sens du regard : +1 si la personne regarde vers la droite de l'image
    if pts[0, 2] >= CONF_MIN:
        sens = 1 if pts[0, 0] >= oreille[0] else -1
    else:
        sens = 1 if oreille[0] >= epaule[0] else -1

    # Tête : 90° = oreille à la verticale de l'épaule ; plus l'angle baisse, plus la tête avance.
    tete = math.degrees(math.atan2(epaule[1] - oreille[1], (oreille[0] - epaule[0]) * sens))
    # Tronc : 0° = droit ; > 0 = penché en avant ; < 0 = penché en arrière (avachi).
    tronc = math.degrees(math.atan2((epaule[0] - hanche[0]) * sens, hanche[1] - epaule[1]))
    # Oreille–épaule–hanche (mesure complémentaire à tester au T3) : angle au niveau de l'épaule.
    # 180° = tête dans l'alignement du tronc ; < 180° = tête en avant ; > 180° = tête en arrière.
    # Ne dépend pas de l'inclinaison de la caméra : une rotation de l'image décale tete et tronc
    # du même angle en sens inverse, la somme reste la même.
    tete_tronc = 90 + tete + tronc
    longueur_tronc = float(np.linalg.norm(epaule - hanche))
    return {"cote": cote, "tete": tete, "tronc": tronc, "tete_tronc": tete_tronc, "cou": angle_cou(pts, cote),
            "longueur_tronc": longueur_tronc, "ecart_epaules": ecart}


def postures(a, seuils=SEUILS):
    """Règle d'alerte (algo-posture.md). Renvoie {posture: (mauvaise ?, règle appliquée)}.

    seuils : evaluer.py en essaie d'autres.
    """
    t, c, al, cp = seuils["tete"], seuils["tronc"], seuils["allonge"], seuils["cou"]
    # Une seule cause vers l'avant, par ordre : dos penché, puis cou penché, puis tête en avant
    # (regarder son téléphone baisse aussi l'angle de la tête).
    cou = a.get("cou") is not None and a["cou"] > cp and a["tronc"] <= c
    return {
        "Tete en avant": (a["tete"] < t and a["tronc"] <= c and not cou, f"tete < {t}"),
        "Dos penche": (a["tronc"] > c, f"tronc > {c}"),
        "Cou penche": (cou, f"cou > {cp}"),
        "Allonge dans la chaise": (a["tronc"] < al, f"tronc < {al}"),
    }


def personne_vue(pts):
    """Quelqu'un est-il devant la caméra ? (une oreille ou une épaule bien vue, même si l'image est ignorée)"""
    return float(pts[[3, 4, 5, 6], 2].max()) >= CONF_MIN


# ---------- Filtre dans le temps (algo-posture.md ⑤) ----------

FENETRE = 60             # s : verdicts gardés dans le bocal
TAUX_ALERTE = 0.70       # début d'alerte…
CONFIRMATION = 120       # s : … si le taux reste au-dessus pendant ce temps
TAUX_FIN = 0.40          # fin d'alerte (l'écart 70 / 40 évite une alerte qui clignote)
ANTI_RAFALE = 600        # s après la fin d'une alerte avant une nouvelle alerte de la même cause
# « Levez-vous » : temps assis sans pause. La règle de la doc (points presque immobiles, < 0,02 du
# tronc) ne peut pas marcher : mesuré le 12/10, les points tremblent de 0,025 d'une image à l'autre
# en travail normal. Une pause = la personne quitte le champ de la caméra au moins PAUSE_MIN.
ASSIS_MAX = 50 * 60      # s
PAUSE_MIN = 60           # s


class Bocal:
    """Fenêtre glissante des verdicts d'une famille de postures (algo-posture.md ⑤, « le bocal »).

    Une image bonne donne une bille sans cause, une image mauvaise une bille avec sa cause ; une
    image ignorée ne donne pas de bille. L'alerte porte le nom de la cause la plus fréquente ; si
    une autre cause devient la plus fréquente pendant toute une confirmation, l'alerte change de nom
    (fin de l'ancienne, début de la nouvelle).
    regroupement : {cause: nom d'alerte} pour donner un seul nom à des causes que la caméra confond.
    """

    def __init__(self, fenetre=FENETRE, confirmation=CONFIRMATION, anti_rafale=ANTI_RAFALE, regroupement=None):
        self.fenetre, self.confirmation, self.anti_rafale = fenetre, confirmation, anti_rafale
        self.regroupement = regroupement or {}
        self.billes = deque()          # (instant, cause ou None, angles)
        self.depuis = None             # instant où le taux a passé TAUX_ALERTE
        self.alerte = None             # cause de l'alerte en cours
        self.autre = None              # (cause devenue la plus fréquente pendant l'alerte, depuis quand)
        self.fins = {}                 # cause → instant de la fin de sa dernière alerte

    def elaguer(self, instant):
        """Retire les billes trop vieilles. Renvoie les événements, comme ajouter().

        Fenêtre vide (personne absente, ou mal vue pendant toute la fenêtre) : on ne peut plus rien
        juger, donc le compte des 2 min repart de zéro (sinon une seule image penchée en se
        rasseyant déclenchait l'alerte) et l'alerte en cours se termine (sinon elle restait ouverte
        pendant toute l'absence).
        """
        while self.billes and self.billes[0][0] <= instant - self.fenetre:
            self.billes.popleft()
        if self.billes:
            return []
        self.depuis = self.autre = None
        return self.terminer(instant) if self.alerte else []

    def terminer(self, instant):
        ancienne = self.alerte
        self.alerte = self.depuis = self.autre = None
        self.fins[ancienne] = instant
        return [("fin", ancienne)]

    def taux(self):
        return sum(c is not None for _, c, _ in self.billes) / len(self.billes) if self.billes else 0.0

    def couleur(self):
        return "rouge" if self.alerte else "orange" if self.taux() >= TAUX_FIN else "vert"

    def mauvaise_recente(self):
        """Au moins une image mauvaise dans la fenêtre : la cadence passe à 2 s."""
        return any(c is not None for _, c, _ in self.billes)

    def detail(self):
        """Part de chaque cause (avant regroupement) parmi les images mauvaises, en %."""
        causes = Counter(c for _, c, _ in self.billes if c)
        return {c: round(100 * n / sum(causes.values())) for c, n in causes.most_common()}

    def moyennes(self):
        """Angles moyens des images mauvaises de la fenêtre (envoyés avec l'événement)."""
        mauvaises = [a for _, c, a in self.billes if c is not None] or [a for _, _, a in self.billes]
        if not mauvaises:
            return None                # fenêtre vide (alerte terminée pendant une absence)
        return {k: round(float(np.mean([a[k] for a in mauvaises])), 1) for k in ("tete", "tronc")}

    def ajouter(self, instant, cause, a):
        """Ajoute le verdict d'une image. Renvoie la liste des événements : ("debut" / "fin", cause)."""
        self.billes.append((instant, cause, a))
        self.elaguer(instant)
        taux = self.taux()
        noms = Counter(self.regroupement.get(c, c) for _, c, _ in self.billes if c)
        principale = noms.most_common(1)[0][0] if taux else None
        if self.alerte is None:
            if taux < TAUX_ALERTE:
                self.depuis = None
                return []
            if self.depuis is None:
                self.depuis = instant
            # anti-rafale par cause : un « cou penché » juste après un « dos penché » reste signalé
            if instant - self.depuis >= self.confirmation and self.anti_rafale_passe(principale, instant):
                self.alerte = principale
                return [("debut", principale)]
            return []
        if taux < TAUX_FIN:
            return self.terminer(instant)
        if principale == self.alerte:
            self.autre = None
        elif self.autre is None or self.autre[0] != principale:
            self.autre = (principale, instant)
        elif instant - self.autre[1] >= self.confirmation and self.anti_rafale_passe(principale, instant):
            ancienne, self.alerte, self.autre = self.alerte, principale, None
            self.fins[ancienne] = instant
            return [("fin", ancienne), ("debut", principale)]
        return []

    def anti_rafale_passe(self, cause, instant):
        return instant - self.fins.get(cause, -math.inf) >= self.anti_rafale


class TempsAssis:
    """Temps passé devant la caméra sans pause ; une pause = absent au moins PAUSE_MIN."""

    def __init__(self, assis_max=ASSIS_MAX, pause_min=PAUSE_MIN):
        self.assis_max, self.pause_min = assis_max, pause_min
        self.debut = None              # début de la période assise en cours
        self.derniere_vue = None
        self.alerte = False

    def duree(self, instant):
        return instant - self.debut if self.debut is not None else 0.0

    def maj(self, instant, vue):
        """vue : quelqu'un est-il devant la caméra ? Renvoie "debut", "fin" ou None."""
        en_pause = self.derniere_vue is not None and instant - self.derniere_vue >= self.pause_min
        if not vue:
            if en_pause and self.alerte:
                self.alerte = False
                return "fin"               # elle s'est levée : l'alerte a été suivie
            return None
        if self.debut is None or en_pause:
            self.debut, self.alerte = instant, False
        self.derniere_vue = instant
        if not self.alerte and self.duree(instant) >= self.assis_max:
            self.alerte = True
            return "debut"
        return None


DUREE_RESUME = 300       # s : un résumé toutes les 5 min (audit §7.2)


class Resume:
    """Temps passé dans chaque état sur une période, et score = % du temps en bonne posture.

    Chaque image compte pour la durée jusqu'à l'image suivante : sinon les moments « en doute »
    (une image toutes les 2 s) pèseraient 5 fois plus que les moments calmes (toutes les 10 s).
    Le temps ignoré (image mal vue) et absent ne compte pas dans le score.
    """

    def __init__(self):
        self.secondes = Counter()      # vert, orange, rouge, ignore, absent
        self.bonne = 0.0               # secondes où l'image elle-même était bonne

    def ajouter(self, duree, etat, bonne=False):
        """etat : couleur du bocal, ou "ignore" / "absent" ; bonne : l'image était-elle bonne ?"""
        self.secondes[etat] += duree
        self.bonne += duree if bonne else 0.0

    def score(self):
        suivi = sum(self.secondes[c] for c in ("vert", "orange", "rouge"))
        return round(100 * self.bonne / suivi) if suivi else None


def reference(liste_angles):
    """Posture de référence = médiane des angles relevés pendant la calibration (None si aucun)."""
    if not liste_angles:
        return None
    return {"tete": float(np.median([a["tete"] for a in liste_angles])),
            "tronc": float(np.median([a["tronc"] for a in liste_angles]))}


# ---------- Enregistrement des mesures (jamais d'image) ----------

COLONNES_CSV = (["heure", "etiquette", "cote", "conf_oreille", "conf_epaule", "conf_hanche", "tete", "tronc",
                 "tete_tronc", "cou", "ecart_epaules", "longueur_tronc", "calibre", "ref_tete", "ref_tronc",
                 "regle_tete_avant", "regle_dos_penche", "regle_cou", "regle_allonge", "point_complete"]
                + [f"{c}{i}" for i in range(17) for c in ("x", "y", "c")])


def ligne_csv(etiquette, pts, cote, a, ref, complete=None):
    """Une ligne de chiffres par image (colonnes COLONNES_CSV) ; angles vides si l'image est ignorée.

    pts : points bruts de MoveNet (confiances réelles) ; complete : point repris de l'image d'avant.
    """
    o, e, h = COTES[cote]
    regles = [int(m) for m, _ in postures(a).values()] if a else ["", "", "", ""]
    valeurs = ([a[k] for k in ("tete", "tronc", "tete_tronc")] + [a["cou"] if a["cou"] is not None else ""]
               if a else ["", "", "", ""]) \
        + [a["ecart_epaules"] if a and a["ecart_epaules"] is not None else "", a["longueur_tronc"] if a else ""]
    return ([datetime.now().isoformat(timespec="milliseconds"), etiquette, cote,
             f"{pts[o, 2]:.3f}", f"{pts[e, 2]:.3f}", f"{pts[h, 2]:.3f}"]
            + [f"{v:.2f}" if isinstance(v, float) else v for v in valeurs]
            + [int(ref is not None)] + ([f"{ref['tete']:.2f}", f"{ref['tronc']:.2f}"] if ref else ["", ""])
            + regles + [complete or ""]
            + [f"{v:.3f}" for v in pts.reshape(-1)])


# ---------- État du Pi ----------

def temperature_pi():
    """Température du processeur en °C (None si vcgencmd est absent, par exemple sur un PC)."""
    try:
        sortie = subprocess.run(["vcgencmd", "measure_temp"], capture_output=True, text=True).stdout
        return float(sortie.split("=")[1].split("'")[0])
    except (OSError, IndexError, ValueError):
        return None


def throttled_pi():
    """Indicateur de ralentissement / sous-tension du Pi (0x0 = rien à signaler)."""
    try:
        sortie = subprocess.run(["vcgencmd", "get_throttled"], capture_output=True, text=True).stdout
        return sortie.strip().split("=")[1]
    except (OSError, IndexError):
        return "?"

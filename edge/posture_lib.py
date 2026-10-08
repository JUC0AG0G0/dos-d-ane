"""Fonctions communes du POC edge : caméra, MoveNet, angles, règles de posture.

Utilisé par poc.py (la vraie session), live.py (debug) et les scripts de tests_poc/.
Aucune image n'est jamais écrite : elles n'existent qu'en mémoire.
"""

import math
import subprocess
from pathlib import Path

import cv2
import numpy as np
from ai_edge_litert.interpreter import Interpreter

DOSSIER_EDGE = Path(__file__).resolve().parent
MODELE_PAR_DEFAUT = DOSSIER_EDGE / "models" / "movenet_lightning_int8.tflite"
DOSSIER_RESULTATS = DOSSIER_EDGE / "resultats"

CONF_MIN = 0.3        # en dessous, un point est jugé mal détecté
ECART_EPAULES_MAX = 0.35   # écart des 2 épaules ÷ tronc ; au-delà, la personne n'est pas de profil

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
    return image if ok else None


# ---------- MoveNet ----------

class MoveNet:
    def __init__(self, chemin=MODELE_PAR_DEFAUT, threads=4):
        self.modele = Interpreter(model_path=str(chemin), num_threads=threads)
        self.modele.allocate_tensors()
        self.entree = self.modele.get_input_details()[0]
        self.sortie = self.modele.get_output_details()[0]

    def points(self, image_bgr):
        """Renvoie 17 points (x, y en pixels, confiance entre 0 et 1)."""
        h, w = image_bgr.shape[:2]
        cote = max(h, w)                                   # on complète en carré
        carre = np.zeros((cote, cote, 3), dtype=np.uint8)  # pour ne pas déformer
        haut, gauche = (cote - h) // 2, (cote - w) // 2    # la personne
        carre[haut:haut + h, gauche:gauche + w] = image_bgr
        rgb = cv2.cvtColor(carre, cv2.COLOR_BGR2RGB)
        x = cv2.resize(rgb, (192, 192))[np.newaxis].astype(self.entree["dtype"])
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


def ecart_epaules(pts):
    """Écart horizontal entre les deux épaules ÷ longueur du tronc : ≈ 0 de profil, ≈ 0,8 de face.

    None si non mesurable : de profil, l'épaule côté mur est souvent cachée, et c'est normal.
    """
    _, e, h = COTES[cote_vu(pts)]
    if min(pts[5, 2], pts[6, 2], pts[h, 2]) < CONF_MIN:
        return None
    longueur_tronc = float(np.linalg.norm(pts[e, :2] - pts[h, :2]))
    if longueur_tronc <= 0:
        return None
    return abs(float(pts[5, 0] - pts[6, 0])) / longueur_tronc


def angles(pts):
    """Angles de la tête et du tronc du côté le mieux vu (§5.3). None si points peu fiables."""
    cote = cote_vu(pts)
    o, e, h = COTES[cote]
    if min(pts[o, 2], pts[e, 2], pts[h, 2]) < CONF_MIN:
        return None                                    # capture ignorée (UNKNOWN)
    ecart = ecart_epaules(pts)
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
    return {"cote": cote, "tete": tete, "tronc": tronc, "tete_tronc": tete_tronc,
            "longueur_tronc": longueur_tronc, "ecart_epaules": ecart}


def postures(a, ref=None):
    """Règles du §5.4. Renvoie {posture: (mauvaise ?, règle appliquée)}.

    ref : posture de référence {"tete": …, "tronc": …} issue de la calibration, ou None.
    """
    if ref is None:
        return {
            "Tete en avant": (a["tete"] < 50, "tete < 50"),
            "Dos penche en avant": (a["tronc"] > 20, "tronc > 20"),
            "Avachi en arriere": (a["tronc"] < -25, "tronc < -25"),
        }
    rt, rc = ref["tete"], ref["tronc"]
    return {
        "Tete en avant": (a["tete"] < rt - 8, f"tete < {rt - 8:.0f}"),
        "Dos penche en avant": (a["tronc"] > rc + 12, f"tronc > {rc + 12:.0f}"),
        "Avachi en arriere": (a["tronc"] < rc - 12, f"tronc < {rc - 12:.0f}"),
    }


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

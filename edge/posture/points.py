"""Points MoveNet : côté vu, point mal vu complété, personne présente (contrôles C1, C2 bis)."""

import time

# En dessous, un point est jugé mal détecté. 0,20 et non 0,30 : de profil, l'oreille et l'épaule
# sont souvent vues entre 0,20 et 0,30 ; mesuré le 08/10/2026 (331 images), le seuil de 0,30 rejetait
# 20 % des images alors que leurs angles étaient les mêmes que les autres (99 % exploitables à 0,20).
CONF_MIN = 0.2

# Numéros MoveNet des points utiles, par côté : oreille, épaule, hanche (le nez est le n° 0)
COTES = {"gauche": (3, 5, 11), "droite": (4, 6, 12)}

# Paires de points reliées pour dessiner le squelette
SQUELETTE = [
    (0, 1), (0, 2), (1, 3), (2, 4),            # visage : nez, yeux, oreilles
    (5, 6), (5, 7), (7, 9), (6, 8), (8, 10),   # épaules, bras
    (5, 11), (6, 12), (11, 12),                # tronc
    (11, 13), (13, 15), (12, 14), (14, 16),    # jambes
]


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


def personne_vue(pts):
    """Quelqu'un est-il devant la caméra ? (une oreille ou une épaule bien vue, même si l'image est ignorée)"""
    return float(pts[[3, 4, 5, 6], 2].max()) >= CONF_MIN

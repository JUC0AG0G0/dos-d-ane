"""Des points aux angles : tête, tronc, cou (contrôles C3 « de profil » et « angles possibles » compris)."""

import math

import numpy as np

from posture.points import CONF_MIN, COTES, cote_vu

ECART_EPAULES_MAX = 0.35   # écart des 2 épaules ÷ tronc ; au-delà, la personne n'est pas de profil
# Angles possibles pour une personne assise. Hors de ces bornes, ce sont des points fantômes : le 14/10,
# devant une chaise vide, MoveNet donnait tête −55°, tronc −77° ou un tronc de 33 à 41 px. Sur 13 519
# images réelles (12–14/10) : tête 2° à 162°, tronc −56° à +46°, tronc d'au moins 108 px (en 640×480).
TETE_MIN, TRONC_MAX, LONGUEUR_TRONC_MIN = 0, 70, 80


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
    """Angles de la tête et du tronc (algo-posture.md §4). None si points peu fiables.

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
    if tete < TETE_MIN or abs(tronc) > TRONC_MAX or longueur_tronc < LONGUEUR_TRONC_MIN:
        return None                                    # angles impossibles : points fantômes (UNKNOWN)
    return {"cote": cote, "tete": tete, "tronc": tronc, "tete_tronc": tete_tronc, "cou": angle_cou(pts, cote),
            "longueur_tronc": longueur_tronc, "ecart_epaules": ecart}

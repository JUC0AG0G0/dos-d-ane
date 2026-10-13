"""Fabrique des points MoveNet synthétiques, avec les angles voulus (pas de webcam ni de modèle)."""

import math

import numpy as np

from posture.points import COTES


def personne(tete=80, tronc=0, cou=15, cote="gauche", regard="droite", conf=0.8, ecart=0.0,
             epaule=(320, 200), longueur_tronc=200, longueur_tete=60):
    """17 points (x, y, confiance) d'une personne de profil.

    tete, tronc, cou : angles voulus en degrés (définitions de algo-posture.md §4).
    cote : côté tourné vers la caméra ; regard : sens dans lequel la personne regarde dans l'image.
    ecart : écart horizontal des deux épaules ÷ longueur du tronc (0 = parfaitement de profil).
    Les points de l'autre côté ont une confiance basse (0,05), comme le côté caché de profil.
    """
    sens = 1 if regard == "droite" else -1
    pts = np.zeros((17, 3), dtype=np.float32)
    pts[:, 2] = 0.05
    o, e, h = COTES[cote]
    autre = COTES["droite" if cote == "gauche" else "gauche"]
    sx, sy = epaule
    t, r, c = math.radians(tete), math.radians(tronc), math.radians(cou)
    hx, hy = sx - sens * longueur_tronc * math.sin(r), sy + longueur_tronc * math.cos(r)
    ox, oy = sx + sens * longueur_tete * math.cos(t), sy - longueur_tete * math.sin(t)
    nx, ny = ox + sens * 30 * math.cos(c), oy + 30 * math.sin(c)
    pts[o] = (ox, oy, conf)
    pts[e] = (sx, sy, conf)
    pts[h] = (hx, hy, conf)
    pts[0] = (nx, ny, conf)                                    # nez
    pts[autre[1]] = (sx + ecart * longueur_tronc, sy, conf)    # épaule côté mur
    return pts

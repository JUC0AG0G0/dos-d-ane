"""Fenêtre de debug : image de la webcam + points du corps détectés par MoveNet.

Aucune analyse (ni angles ni règles) et aucun enregistrement : l'image reste en mémoire.

Touches : q = quitter, p = mode vie privée (squelette sur fond noir, sans l'image).
Lancer depuis edge/ avec .venv activé :  python live.py
"""

import time

import cv2
import numpy as np
from ai_edge_litert.interpreter import Interpreter

MODELE = "models/movenet_lightning_int8.tflite"
CONF_MIN = 0.3  # en dessous, le point est jugé mal détecté et n'est pas dessiné

# Paires de points à relier pour dessiner le squelette (numéros MoveNet)
SQUELETTE = [
    (0, 1), (0, 2), (1, 3), (2, 4),            # visage : nez, yeux, oreilles
    (5, 6), (5, 7), (7, 9), (6, 8), (8, 10),   # épaules, bras
    (5, 11), (6, 12), (11, 12),                # tronc
    (11, 13), (13, 15), (12, 14), (14, 16),    # jambes
]
# Points utiles à la posture, mis en évidence : oreilles, épaules, hanches
POINTS_POSTURE = {3, 4, 5, 6, 11, 12}

cam = cv2.VideoCapture(0)
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

modele = Interpreter(model_path=MODELE, num_threads=4)
modele.allocate_tensors()
entree = modele.get_input_details()[0]
sortie = modele.get_output_details()[0]


def points_du_corps(image_bgr):
    """Renvoie 17 points (x, y en pixels, confiance entre 0 et 1)."""
    h, w = image_bgr.shape[:2]
    cote = max(h, w)                                   # on complète en carré
    carre = np.zeros((cote, cote, 3), dtype=np.uint8)  # pour ne pas déformer
    haut, gauche = (cote - h) // 2, (cote - w) // 2    # la personne
    carre[haut:haut + h, gauche:gauche + w] = image_bgr
    rgb = cv2.cvtColor(carre, cv2.COLOR_BGR2RGB)
    x = cv2.resize(rgb, (192, 192))[np.newaxis].astype(entree["dtype"])
    modele.set_tensor(entree["index"], x)
    modele.invoke()
    res = modele.get_tensor(sortie["index"])[0, 0]     # 17 × (y, x, score)
    pts = np.empty((17, 3), dtype=np.float32)
    pts[:, 0] = res[:, 1] * cote - gauche              # x en pixels
    pts[:, 1] = res[:, 0] * cote - haut                # y en pixels
    pts[:, 2] = res[:, 2]                              # confiance
    return pts


def dessiner(image, pts):
    for a, b in SQUELETTE:
        if pts[a, 2] >= CONF_MIN and pts[b, 2] >= CONF_MIN:
            pa = (int(pts[a, 0]), int(pts[a, 1]))
            pb = (int(pts[b, 0]), int(pts[b, 1]))
            cv2.line(image, pa, pb, (255, 255, 0), 2)
    for i, (x, y, conf) in enumerate(pts):
        if conf >= CONF_MIN:
            couleur = (0, 0, 255) if i in POINTS_POSTURE else (0, 255, 0)
            cv2.circle(image, (int(x), int(y)), 6 if i in POINTS_POSTURE else 4, couleur, -1)


vie_privee = False
t_precedent = time.perf_counter()
while True:
    ok, image = cam.read()
    if not ok:
        print("capture ratée")
        continue

    t0 = time.perf_counter()
    pts = points_du_corps(image)
    ms_ia = (time.perf_counter() - t0) * 1000

    affichage = np.zeros_like(image) if vie_privee else image
    dessiner(affichage, pts)

    maintenant = time.perf_counter()
    ips = 1 / (maintenant - t_precedent)
    t_precedent = maintenant
    cv2.putText(affichage, f"IA {ms_ia:.0f} ms | {ips:.1f} img/s", (10, 25),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    for ligne, (cote, ids) in enumerate((("G", (3, 5, 11)), ("D", (4, 6, 12)))):
        conf = " ".join(f"{pts[i, 2]:.2f}" for i in ids)
        cv2.putText(affichage, f"{cote} oreille/epaule/hanche : {conf}", (10, 50 + 20 * ligne),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    cv2.imshow("Dos d'ane - debug", affichage)

    touche = cv2.waitKey(1) & 0xFF
    if touche == ord("q"):
        break
    if touche == ord("p"):
        vie_privee = not vie_privee

cam.release()
cv2.destroyAllWindows()

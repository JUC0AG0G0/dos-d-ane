"""Fenêtre de debug : webcam + points MoveNet + angles + règles de posture, en direct.

Aucun enregistrement : l'image reste en mémoire. Limité à ~5 images/s pour ne pas
faire chauffer le Pi.

Touches :
    q = quitter
    p = mode vie privée (squelette sur fond noir, sans l'image)
    c = calibration : rester assis droit 10 s, la posture devient la référence
    r = revenir aux règles sans calibration
Lancer depuis edge/ avec .venv activé :  python live.py
"""

import math
import time

import cv2
import numpy as np
from ai_edge_litert.interpreter import Interpreter

MODELE = "models/movenet_lightning_int8.tflite"
CONF_MIN = 0.3        # en dessous, le point est jugé mal détecté
IMAGES_PAR_S = 5      # limite pour la chauffe
DUREE_CALIBRATION = 10

# Paires de points à relier pour dessiner le squelette (numéros MoveNet)
SQUELETTE = [
    (0, 1), (0, 2), (1, 3), (2, 4),            # visage : nez, yeux, oreilles
    (5, 6), (5, 7), (7, 9), (6, 8), (8, 10),   # épaules, bras
    (5, 11), (6, 12), (11, 12),                # tronc
    (11, 13), (13, 15), (12, 14), (14, 16),    # jambes
]
COTES = {"gauche": (3, 5, 11), "droite": (4, 6, 12)}   # oreille, épaule, hanche

BLANC, VERT, ROUGE, ORANGE, GRIS = (255, 255, 255), (0, 200, 0), (0, 0, 255), (0, 165, 255), (160, 160, 160)

cam = cv2.VideoCapture(0, cv2.CAP_V4L2)
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cam.set(cv2.CAP_PROP_BUFFERSIZE, 1)   # une seule image en réserve (sinon elles sont périmées)

modele = Interpreter(model_path=MODELE, num_threads=4)
modele.allocate_tensors()
entree = modele.get_input_details()[0]
sortie = modele.get_output_details()[0]


def capturer(cam):
    cam.grab()                            # jette l'image en réserve
    ok, image = cam.read()                # attend une image fraîche
    return image if ok else None


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


def angles(pts):
    """Angles de la tête et du tronc du côté le mieux vu (§5.3). None si points peu fiables."""
    cote = max(COTES, key=lambda c: pts[list(COTES[c]), 2].mean())
    o, e, h = COTES[cote]
    if min(pts[o, 2], pts[e, 2], pts[h, 2]) < CONF_MIN:
        return None                                    # capture ignorée (UNKNOWN)
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
    return {"cote": cote, "tete": tete, "tronc": tronc}


def postures(a, ref):
    """Règles du §5.4. Renvoie {posture: (mauvaise ?, règle appliquée)}."""
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


def texte(image, txt, ligne, couleur=BLANC, taille=0.55):
    y = 25 + 22 * ligne
    cv2.putText(image, txt, (10, y), cv2.FONT_HERSHEY_SIMPLEX, taille, (0, 0, 0), 4)   # contour
    cv2.putText(image, txt, (10, y), cv2.FONT_HERSHEY_SIMPLEX, taille, couleur, 1)


def dessiner(image, pts, cote_vu):
    for a, b in SQUELETTE:
        if pts[a, 2] >= CONF_MIN and pts[b, 2] >= CONF_MIN:
            cv2.line(image, (int(pts[a, 0]), int(pts[a, 1])), (int(pts[b, 0]), int(pts[b, 1])), (255, 255, 0), 2)
    utiles = set(COTES[cote_vu]) if cote_vu else set()
    for i, (x, y, conf) in enumerate(pts):
        if conf >= CONF_MIN:
            if i in utiles:
                cv2.circle(image, (int(x), int(y)), 7, ROUGE, -1)
            else:
                cv2.circle(image, (int(x), int(y)), 4, VERT, -1)
    if cote_vu:                                        # relier oreille → épaule → hanche
        o, e, h = COTES[cote_vu]
        for a, b in ((o, e), (e, h)):
            cv2.line(image, (int(pts[a, 0]), int(pts[a, 1])), (int(pts[b, 0]), int(pts[b, 1])), ROUGE, 3)


vie_privee = False
reference = None          # posture de référence (calibration)
calibration = None        # liste des angles pendant la calibration, None sinon
fin_calibration = 0.0

while True:
    t_boucle = time.perf_counter()
    image = capturer(cam)
    if image is None:
        print("capture ratée")
        continue

    t0 = time.perf_counter()
    pts = points_du_corps(image)
    ms_ia = (time.perf_counter() - t0) * 1000
    a = angles(pts)

    affichage = np.zeros_like(image) if vie_privee else image
    dessiner(affichage, pts, a["cote"] if a else None)
    texte(affichage, f"IA {ms_ia:.0f} ms | {'calibre' if reference else 'sans calibration'}", 0)

    if a is None:
        texte(affichage, "UNKNOWN : oreille, epaule ou hanche mal vue", 1, GRIS)
    else:
        texte(affichage, f"Cote {a['cote']} | Tete {a['tete']:.0f} deg | Tronc {a['tronc']:+.0f} deg", 1, BLANC, 0.6)
        for i, (nom, (mauvaise, regle)) in enumerate(postures(a, reference).items()):
            texte(affichage, f"{nom} : {'OUI' if mauvaise else 'non'}  ({regle})", 2 + i, ROUGE if mauvaise else VERT)

    if calibration is not None:
        reste = fin_calibration - time.monotonic()
        if a:
            calibration.append((a["tete"], a["tronc"]))
        if reste > 0:
            texte(affichage, f"CALIBRATION : restez assis droit... {reste:.0f} s", 6, ORANGE, 0.7)
        elif calibration:
            reference = {"tete": float(np.median([t for t, _ in calibration])),
                         "tronc": float(np.median([c for _, c in calibration]))}
            print(f"Référence : tête {reference['tete']:.1f}°, tronc {reference['tronc']:+.1f}° "
                  f"({len(calibration)} images)")
            calibration = None
        else:
            print("Calibration ratée : personne mal vue pendant 10 s")
            calibration = None

    cv2.imshow("Dos d'ane - debug", affichage)
    touche = cv2.waitKey(1) & 0xFF
    if touche == ord("q"):
        break
    if touche == ord("p"):
        vie_privee = not vie_privee
    if touche == ord("c"):
        calibration, fin_calibration = [], time.monotonic() + DUREE_CALIBRATION
    if touche == ord("r"):
        reference = None

    time.sleep(max(0.0, 1 / IMAGES_PAR_S - (time.perf_counter() - t_boucle)))

cam.release()
cv2.destroyAllWindows()

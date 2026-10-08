"""Outil de debug : webcam + points MoveNet + angles + règles de posture, en direct.

Ne sert pas en session réelle (voir poc.py) : il analyse en continu pour régler et montrer.
Aucun enregistrement : l'image reste en mémoire. Limité à ~5 images/s pour ne pas
faire chauffer le Pi.

Touches :
    q = quitter
    p = mode vie privée (squelette sur fond noir, sans l'image)
    c = calibration : rester assis droit 10 s, la posture devient la référence
    r = revenir aux règles sans calibration
Lancer depuis edge/ avec .venv activé :  python live.py
"""

import time

import cv2
import numpy as np

from posture_lib import COTES, CONF_MIN, SQUELETTE, MoveNet, angles, capturer, ouvrir_camera, postures

IMAGES_PAR_S = 5      # limite pour la chauffe
DUREE_CALIBRATION = 10

BLANC, VERT, ROUGE, ORANGE, GRIS = (255, 255, 255), (0, 200, 0), (0, 0, 255), (0, 165, 255), (160, 160, 160)


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


def main():
    cam = ouvrir_camera()
    movenet = MoveNet()

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
        pts = movenet.points(image)
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


if __name__ == "__main__":
    main()

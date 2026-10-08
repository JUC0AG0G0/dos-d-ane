"""Outil de debug : webcam + points MoveNet + angles + règles de posture, en direct.

Ne sert pas en session réelle (voir poc.py) : il analyse en continu pour régler et montrer.
Aucun enregistrement : l'image reste en mémoire. Limité à ~5 images/s pour ne pas
faire chauffer le Pi.

Touches (dans la fenêtre, ou tapées dans le terminal puis Entrée, utile sans clavier sur le Pi) :
    q = quitter
    f = changer d'affichage : tout flouté (par défaut) → normal → fond noir → tout flouté…
    p = fond noir directement (squelette seul, sans l'image)
    c = calibration : rester assis droit 10 s, la posture devient la référence
    r = revenir aux règles sans calibration
Lancer depuis edge/ avec .venv activé :  python live.py
Depuis le PC, fenêtre sur l'écran du Pi et commandes dans le terminal du PC :
    ssh -t pi 'cd ~/dos-d-ane/edge && DISPLAY=:0 XDG_RUNTIME_DIR=/run/user/1000 .venv/bin/python live.py'
"""

import queue
import sys
import threading
import time

import cv2
import numpy as np

from posture_lib import (COTES, CONF_MIN, ECART_EPAULES_MAX, SQUELETTE, MoveNet, angles, capturer,
                         ecart_epaules, ouvrir_camera, postures)

IMAGES_PAR_S = 5      # limite pour la chauffe
DUREE_CALIBRATION = 10

BLANC, VERT, ROUGE, ORANGE, GRIS = (255, 255, 255), (0, 200, 0), (0, 0, 255), (0, 165, 255), (160, 160, 160)

# Modes d'affichage. « flou » par défaut : visages (y compris des personnes au fond, que
# MoveNet ne voit pas) et écrans illisibles, mais silhouettes visibles pour placer la caméra.
MODES = ["flou", "normal", "noir"]


def image_affichee(image, mode):
    """Image à afficher selon le mode. L'analyse, elle, se fait toujours sur l'image nette."""
    if mode == "noir":
        return np.zeros_like(image)
    if mode == "flou":                    # pixellisation : ~3 ms sur le Pi, contre ~30 ms pour un flou gaussien
        h, w = image.shape[:2]
        petit = cv2.resize(image, (40, 30), interpolation=cv2.INTER_AREA)
        return cv2.resize(petit, (w, h), interpolation=cv2.INTER_NEAREST)
    return image


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


def lire_terminal(commandes):
    """Met dans la file chaque commande tapée dans le terminal (q, p, c, r + Entrée)."""
    for ligne in sys.stdin:
        if ligne.strip():
            commandes.put(ligne.strip()[0].lower())


def main():
    cam = ouvrir_camera()
    movenet = MoveNet()
    commandes = queue.Queue()
    threading.Thread(target=lire_terminal, args=(commandes,), daemon=True).start()
    print("Commandes : c = calibration, f = affichage (flou / normal / noir), p = fond noir, "
          "r = sans calibration, q = quitter (puis Entrée)")
    dernier_affichage = 0.0

    mode = "flou"
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
        ecart = ecart_epaules(pts)
        de_face = ecart is not None and ecart > ECART_EPAULES_MAX

        affichage = image_affichee(image, mode)
        dessiner(affichage, pts, a["cote"] if a else None)
        profil = "epaule cachee" if ecart is None else f"ecart epaules {ecart:.2f}"
        texte(affichage, f"IA {ms_ia:.0f} ms | {'calibre' if reference else 'sans calibration'} | {profil} "
                         f"| affichage {mode}", 0)

        if a is None and de_face:
            texte(affichage, f"UNKNOWN : pas de profil (ecart > {ECART_EPAULES_MAX})", 1, ORANGE)
        elif a is None:
            texte(affichage, "UNKNOWN : oreille, epaule ou hanche mal vue", 1, GRIS)
        else:
            texte(affichage, f"Cote {a['cote']} | Tete {a['tete']:.0f} | Tronc {a['tronc']:+.0f} | "
                             f"Oreille-epaule-hanche {a['tete_tronc']:.0f} (deg)", 1, BLANC, 0.55)
            regles = postures(a, reference)
            for i, (nom, (mauvaise, regle)) in enumerate(regles.items()):
                texte(affichage, f"{nom} : {'OUI' if mauvaise else 'non'}  ({regle})", 2 + i, ROUGE if mauvaise else VERT)
            if time.monotonic() - dernier_affichage >= 1:   # une ligne par seconde dans le terminal
                dernier_affichage = time.monotonic()
                mauvaises = [nom for nom, (m, _) in regles.items() if m] or ["bonne posture"]
                print(f"{time.strftime('%H:%M:%S')}  {a['cote']:6s}  tête {a['tete']:4.0f}°  "
                      f"tronc {a['tronc']:+4.0f}°  oreille-épaule-hanche {a['tete_tronc']:4.0f}°  "
                      f"→ {', '.join(mauvaises)}")

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
        if touche == 255 and not commandes.empty():          # aucune touche : commande du terminal ?
            touche = ord(commandes.get())
        if touche == ord("c"):
            print("Calibration : restez assis droit 10 s…")
        if touche == ord("q"):
            break
        if touche == ord("p"):
            mode = "flou" if mode == "noir" else "noir"
        if touche == ord("f"):
            mode = MODES[(MODES.index(mode) + 1) % len(MODES)]
        if touche == ord("c"):
            calibration, fin_calibration = [], time.monotonic() + DUREE_CALIBRATION
        if touche == ord("r"):
            reference = None

        time.sleep(max(0.0, 1 / IMAGES_PAR_S - (time.perf_counter() - t_boucle)))

    cam.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:     # Ctrl+C dans le terminal
        pass

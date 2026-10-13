"""Outil de debug : webcam + points MoveNet + angles + règles de posture, en direct.

Ne sert pas en session réelle (voir poc.py) : il analyse en continu pour régler et montrer.
Aucun enregistrement : l'image reste en mémoire. Limité à ~5 images/s pour ne pas
faire chauffer le Pi.

Touches (dans la fenêtre, ou tapées dans le terminal puis Entrée, utile sans clavier sur le Pi) :
    q = quitter
    f = changer d'affichage : tout flouté (par défaut) → normal → fond noir → tout flouté…
    p = fond noir directement (squelette seul, sans l'image)
    c = calibration : travailler normalement 2 min, la médiane des angles devient la référence
        (notée dans le CSV, pour le score ; la règle d'alerte n'en dépend pas)
    r = oublier la référence
    0 à 5 = enregistrer chaque image dans resultats/live_<date>.csv avec une étiquette :
            0 bonne posture, 1 tête en avant, 2 dos penché, 3 allongé dans la chaise, 4 dos en « C »,
            5 cou penché (regarder son téléphone)
    9 = arrêter l'enregistrement
Le CSV ne contient que des chiffres (angles, points), jamais d'image, et reste sur le Pi.
Lancer depuis edge/ avec .venv activé :  python live.py
Depuis le PC, fenêtre sur l'écran du Pi et commandes dans le terminal du PC :
    ssh -t pi 'cd ~/dos-d-ane/edge && DISPLAY=:0 XDG_RUNTIME_DIR=/run/user/1000 .venv/bin/python live.py'
"""

import csv
import queue
import sys
import threading
import time
from datetime import datetime

import cv2
import numpy as np

from posture.angles import ECART_EPAULES_MAX, angles, ecart_epaules
from posture.camera import capturer, ouvrir_camera
from posture.chemins import DOSSIER_RESULTATS
from posture.mesures import COLONNES_CSV, ligne_csv
from posture.movenet import MoveNet
from posture.points import CONF_MIN, COTES, SQUELETTE, Completeur, CoteStable
from posture.regles import DUREE_CALIBRATION, postures, reference

ETIQUETTES = {"0": "GOOD", "1": "FORWARD_HEAD", "2": "TRUNK_FORWARD", "3": "TRUNK_BACKWARD", "4": "C_SHAPE",
              "5": "NECK_FLEXION"}
NOMS_ETIQUETTES = {"GOOD": "bonne posture", "FORWARD_HEAD": "tete en avant", "TRUNK_FORWARD": "dos penche",
                   "TRUNK_BACKWARD": "allonge", "C_SHAPE": "dos en C", "NECK_FLEXION": "cou penche"}

IMAGES_PAR_S = 5      # limite pour la chauffe

BLANC, VERT, ROUGE, ORANGE, GRIS = (255, 255, 255), (0, 200, 0), (0, 0, 255), (0, 165, 255), (160, 160, 160)

# Modes d'affichage. « flou » par défaut : visages (y compris des personnes au fond, que
# MoveNet ne voit pas) et écrans illisibles, mais silhouettes visibles pour placer la caméra.
MODES = ["flou", "normal", "noir"]


def image_affichee(image, mode):
    """Image à afficher selon le mode. L'analyse, elle, se fait toujours sur l'image nette."""
    if mode == "noir":
        return np.zeros_like(image)
    if mode == "flou":                    # « verre dépoli » : ~3 ms sur le Pi, contre ~30 ms pour un flou gaussien
        h, w = image.shape[:2]            # sur l'image entière : on floute une mini-image puis on l'agrandit en lissant
        petit = cv2.GaussianBlur(cv2.resize(image, (64, 48), interpolation=cv2.INTER_AREA), (9, 9), 0)
        return cv2.resize(petit, (w, h), interpolation=cv2.INTER_LINEAR)
    return image


def texte(image, txt, ligne, couleur=BLANC, taille=0.55):
    """Écrit une ligne sur une bande sombre semi-transparente, lisible sur n'importe quel fond.

    (Un contour noir épais autour des lettres bavait sur les images claires : texte comme doublé.)
    """
    y = 25 + 22 * ligne
    (l, h), bas = cv2.getTextSize(txt, cv2.FONT_HERSHEY_SIMPLEX, taille, 1)
    y0, y1, x1 = max(0, y - h - 4), min(image.shape[0], y + bas + 2), min(image.shape[1], 10 + l + 6)
    image[y0:y1, 4:x1] = (image[y0:y1, 4:x1] * 0.35).astype(image.dtype)
    cv2.putText(image, txt, (10, y), cv2.FONT_HERSHEY_SIMPLEX, taille, couleur, 1, cv2.LINE_AA)


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


class Enregistreur:
    """Écrit une ligne de chiffres par image analysée, avec l'étiquette choisie (jamais d'image)."""

    def __init__(self):
        self.fichier = None
        self.ecrivain = None
        self.etiquette = None     # None = pas d'enregistrement en cours
        self.lignes = 0

    def demarrer(self, etiquette):
        if self.fichier is None:
            DOSSIER_RESULTATS.mkdir(exist_ok=True)
            chemin = DOSSIER_RESULTATS / f"live_{datetime.now():%Y-%m-%d_%H%M%S}.csv"
            self.fichier = open(chemin, "w", newline="")
            self.ecrivain = csv.writer(self.fichier)
            self.ecrivain.writerow(COLONNES_CSV)
            print(f"Enregistrement dans {chemin}")
        self.etiquette = etiquette
        print(f"● Enregistrement : {NOMS_ETIQUETTES[etiquette]}")

    def arreter(self):
        if self.etiquette:
            print(f"Enregistrement arrêté ({self.lignes} lignes au total)")
        self.etiquette = None

    def ligne(self, pts, cote, a, ref, complete=None):
        """Une ligne par image si un enregistrement est en cours (voir posture.mesures.ligne_csv)."""
        if not self.etiquette:
            return
        self.ecrivain.writerow(ligne_csv(self.etiquette, pts, cote, a, ref, complete))
        self.fichier.flush()
        self.lignes += 1

    def fermer(self):
        if self.fichier:
            self.fichier.close()


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
          "r = oublier la référence, q = quitter (puis Entrée)")
    print("Enregistrement : 0 bonne, 1 tête en avant, 2 dos penché, 3 allongé, 4 dos en C, 5 cou penché, "
          "9 arrêter")
    dernier_affichage = 0.0
    cote_stable = CoteStable()
    completeur = Completeur()
    enregistreur = Enregistreur()

    mode = "flou"
    ref = None                # posture de référence (calibration)
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
        cote = cote_stable.maj(pts)       # côté bloqué : ne saute plus d'une image à l'autre
        pts_c, complete = completeur.maj(pts, cote)   # trou court : point repris de l'image d'avant
        a = angles(pts_c, cote)
        ecart = ecart_epaules(pts_c, cote)
        de_face = ecart is not None and ecart > ECART_EPAULES_MAX
        enregistreur.ligne(pts, cote, a, ref, complete)

        affichage = image_affichee(image, mode)
        dessiner(affichage, pts_c, a["cote"] if a else None)
        if enregistreur.etiquette:
            texte(affichage, f"* ENREGISTREMENT : {NOMS_ETIQUETTES[enregistreur.etiquette]} "
                             f"({enregistreur.lignes} lignes)", 7, ROUGE, 0.6)
        profil = "epaule cachee" if ecart is None else f"ecart epaules {ecart:.2f}"
        texte(affichage, f"IA {ms_ia:.0f} ms | {'calibre' if ref else 'sans calibration'} | {profil} "
                         f"| affichage {mode}", 0)

        # Diagnostic : confiance des 3 points du côté bloqué, et ceux sous le seuil
        o, e, h = COTES[cote]
        confs = {"oreille": pts[o, 2], "epaule": pts[e, 2], "hanche": pts[h, 2]}
        mal_vus = [nom for nom, c in confs.items() if c < CONF_MIN]
        conf_txt = "  ".join(f"{nom} {c:.2f}" for nom, c in confs.items())
        txt_ecart = "-" if ecart is None else f"{ecart:.2f}"

        if a is None and de_face:
            texte(affichage, f"UNKNOWN : pas de profil (ecart {txt_ecart} > {ECART_EPAULES_MAX})", 1, ORANGE)
        elif a is None:
            texte(affichage, f"UNKNOWN : mal vu ({', '.join(mal_vus)}) - cote {cote}", 1, GRIS)
        else:
            cou = "-" if a["cou"] is None else f"{a['cou']:.0f}"
            texte(affichage, f"Cote {a['cote']} | Tete {a['tete']:.0f} | Tronc {a['tronc']:+.0f} | "
                             f"Cou {cou} (deg)"
                             + (f" | {complete} completee" if complete else ""), 1, BLANC, 0.55)
            regles = postures(a)
            for i, (nom, (mauvaise, regle)) in enumerate(regles.items()):
                texte(affichage, f"{nom} : {'OUI' if mauvaise else 'non'}  ({regle})", 2 + i, ROUGE if mauvaise else VERT)

        if time.monotonic() - dernier_affichage >= 1:   # une ligne par seconde dans le terminal, UNKNOWN compris
            dernier_affichage = time.monotonic()
            debut = f"{time.strftime('%H:%M:%S')}  {cote:6s}"
            if a is None and de_face:
                print(f"{debut}  UNKNOWN pas de profil   écart épaules {txt_ecart}   conf {conf_txt}")
            elif a is None:
                print(f"{debut}  UNKNOWN mal vu : {', '.join(mal_vus)}   conf {conf_txt}")
            else:
                mauvaises = [nom for nom, (m, _) in regles.items() if m] or ["bonne posture"]
                cou = "  -" if a["cou"] is None else f"{a['cou']:3.0f}"
                print(f"{debut}  tête {a['tete']:4.0f}°  tronc {a['tronc']:+4.0f}°  "
                      f"cou {cou}°  écart {txt_ecart}  → {', '.join(mauvaises)}"
                      + (f"   ({complete} complétée)" if complete else ""))

        if calibration is not None:
            reste = fin_calibration - time.monotonic()
            if a:
                calibration.append(a)
            if reste > 0:
                texte(affichage, f"CALIBRATION : travaillez normalement... {reste:.0f} s", 6, ORANGE, 0.7)
            else:
                ref = reference(calibration)
                if ref:
                    print(f"Référence : tête {ref['tete']:.1f}°, tronc {ref['tronc']:+.1f}° "
                          f"({len(calibration)} images)")
                else:
                    print(f"Calibration ratée : personne mal vue pendant {DUREE_CALIBRATION} s")
                calibration = None

        cv2.imshow("Dos d'ane - debug", affichage)
        touche = cv2.waitKey(1) & 0xFF
        if touche == 255 and not commandes.empty():          # aucune touche : commande du terminal ?
            touche = ord(commandes.get())
        if touche == ord("q"):
            break
        if touche == ord("p"):
            mode = "flou" if mode == "noir" else "noir"
        if touche == ord("f"):
            mode = MODES[(MODES.index(mode) + 1) % len(MODES)]
        if touche == ord("c"):
            print(f"Calibration : travaillez normalement {DUREE_CALIBRATION // 60} min…")
            calibration, fin_calibration = [], time.monotonic() + DUREE_CALIBRATION
        if touche == ord("r"):
            ref = None
        if chr(touche) in ETIQUETTES:
            enregistreur.demarrer(ETIQUETTES[chr(touche)])
        if touche == ord("9"):
            enregistreur.arreter()

        time.sleep(max(0.0, 1 / IMAGES_PAR_S - (time.perf_counter() - t_boucle)))

    enregistreur.arreter()
    enregistreur.fermer()
    cam.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:     # Ctrl+C dans le terminal
        pass

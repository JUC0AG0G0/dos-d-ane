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
    0 à 4 = enregistrer chaque image dans resultats/live_<date>.csv avec une étiquette :
            0 bonne posture, 1 tête en avant, 2 dos penché, 3 avachi, 4 dos en « C »
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

from posture_lib import (COTES, CONF_MIN, DOSSIER_RESULTATS, ECART_EPAULES_MAX, SQUELETTE, CoteStable,
                         MoveNet, angles, capturer, ecart_epaules, ouvrir_camera, postures)

ETIQUETTES = {"0": "GOOD", "1": "FORWARD_HEAD", "2": "TRUNK_FORWARD", "3": "TRUNK_BACKWARD", "4": "C_SHAPE"}
NOMS_ETIQUETTES = {"GOOD": "bonne posture", "FORWARD_HEAD": "tete en avant", "TRUNK_FORWARD": "dos penche",
                   "TRUNK_BACKWARD": "avachi", "C_SHAPE": "dos en C"}

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
    if mode == "flou":                    # « verre dépoli » : ~3 ms sur le Pi, contre ~30 ms pour un flou gaussien
        h, w = image.shape[:2]            # sur l'image entière : on floute une mini-image puis on l'agrandit en lissant
        petit = cv2.GaussianBlur(cv2.resize(image, (64, 48), interpolation=cv2.INTER_AREA), (9, 9), 0)
        return cv2.resize(petit, (w, h), interpolation=cv2.INTER_LINEAR)
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
            self.ecrivain.writerow(
                ["heure", "etiquette", "cote", "conf_oreille", "conf_epaule", "conf_hanche", "tete", "tronc",
                 "tete_tronc", "ecart_epaules", "longueur_tronc", "calibre", "regle_tete_avant",
                 "regle_dos_penche", "regle_avachi"]
                + [f"{c}{i}" for i in range(17) for c in ("x", "y", "c")])
            print(f"Enregistrement dans {chemin}")
        self.etiquette = etiquette
        print(f"● Enregistrement : {NOMS_ETIQUETTES[etiquette]}")

    def arreter(self):
        if self.etiquette:
            print(f"Enregistrement arrêté ({self.lignes} lignes au total)")
        self.etiquette = None

    def ligne(self, pts, cote, a, reference):
        """Une ligne par image ; angles vides si l'image est ignorée (utile pour compter au T3)."""
        if not self.etiquette:
            return
        o, e, h = COTES[cote]
        regles = [int(m) for m, _ in postures(a, reference).values()] if a else ["", "", ""]
        valeurs = ([a[k] for k in ("tete", "tronc", "tete_tronc")] if a else ["", "", ""]) \
            + [a["ecart_epaules"] if a and a["ecart_epaules"] is not None else "",
               a["longueur_tronc"] if a else ""]
        self.ecrivain.writerow(
            [datetime.now().isoformat(timespec="milliseconds"), self.etiquette, cote,
             f"{pts[o, 2]:.3f}", f"{pts[e, 2]:.3f}", f"{pts[h, 2]:.3f}"]
            + [f"{v:.2f}" if isinstance(v, float) else v for v in valeurs]
            + [int(reference is not None)] + regles
            + [f"{v:.3f}" for v in pts.reshape(-1)])
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
          "r = sans calibration, q = quitter (puis Entrée)")
    print("Enregistrement : 0 bonne, 1 tête en avant, 2 dos penché, 3 avachi, 4 dos en C, 9 arrêter")
    dernier_affichage = 0.0
    cote_stable = CoteStable()
    enregistreur = Enregistreur()

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
        cote = cote_stable.maj(pts)       # côté bloqué : ne saute plus d'une image à l'autre
        a = angles(pts, cote)
        ecart = ecart_epaules(pts, cote)
        de_face = ecart is not None and ecart > ECART_EPAULES_MAX
        enregistreur.ligne(pts, cote, a, reference)

        affichage = image_affichee(image, mode)
        dessiner(affichage, pts, a["cote"] if a else None)
        if enregistreur.etiquette:
            texte(affichage, f"* ENREGISTREMENT : {NOMS_ETIQUETTES[enregistreur.etiquette]} "
                             f"({enregistreur.lignes} lignes)", 7, ROUGE, 0.6)
        profil = "epaule cachee" if ecart is None else f"ecart epaules {ecart:.2f}"
        texte(affichage, f"IA {ms_ia:.0f} ms | {'calibre' if reference else 'sans calibration'} | {profil} "
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
            texte(affichage, f"Cote {a['cote']} | Tete {a['tete']:.0f} | Tronc {a['tronc']:+.0f} | "
                             f"Oreille-epaule-hanche {a['tete_tronc']:.0f} (deg)", 1, BLANC, 0.55)
            regles = postures(a, reference)
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
                print(f"{debut}  tête {a['tete']:4.0f}°  tronc {a['tronc']:+4.0f}°  "
                      f"oreille-épaule-hanche {a['tete_tronc']:4.0f}°  écart {txt_ecart}  → {', '.join(mauvaises)}")

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

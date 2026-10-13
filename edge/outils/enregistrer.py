"""Enregistrement guidé d'un volontaire (étape 4 du plan de test, données du T5).

Enchaîne tout seul : calibration (2 min de travail normal), puis chaque posture 30 s dans un ordre
tiré au hasard, avec un retour à la posture normale entre deux. Chaque image est écrite dans
resultats/<code>_<date>.csv avec l'étiquette de l'étape en cours (format : posture.mesures.COLONNES_CSV).
Les 5 premières secondes de chaque étape sont étiquetées TRANSITION (la personne est en train de
bouger) et ne comptent pas dans evaluer.py. Aucune image n'est enregistrée.

L'opérateur lit les consignes à voix haute : pendant « tête en avant », le volontaire ne voit pas l'écran.

Lancer depuis edge/ avec .venv activé :
    python -m outils.enregistrer P02
Depuis le PC (fenêtre sur l'écran du Pi, consignes aussi dans le terminal) :
    ssh -t pi 'cd ~/dos-d-ane/edge && DISPLAY=:0 XDG_RUNTIME_DIR=/run/user/1000 .venv/bin/python -m outils.enregistrer P02'
q dans la fenêtre ou Ctrl+C arrête (le CSV garde ce qui a été enregistré).
"""

import argparse
import csv
import random
import re
import time
import unicodedata
from collections import Counter
from datetime import datetime

import cv2

from live import dessiner, image_affichee, texte
from posture.angles import angles
from posture.camera import capturer, ouvrir_camera
from posture.chemins import DOSSIER_RESULTATS
from posture.mesures import COLONNES_CSV, ligne_csv
from posture.movenet import MoveNet
from posture.pi import temperature_pi
from posture.points import Completeur, CoteStable
from posture.regles import DUREE_CALIBRATION, reference

# Le 12/10, seul face au Pi, le volontaire changeait de posture jusqu'à 15 s en retard : il ne voyait
# pas la consigne changer. L'étape suivante est donc annoncée ANNONCE s avant, et les TRANSITION s
# du début de chaque étape (la personne est en train de bouger) ne comptent pas.
TRANSITION = 5
ANNONCE = 5
# TRUNK_BACKWARD : jusqu'à P04 (12/10), consigne « avachissez-vous » ; avachi souvent léger, qui se
# confond avec « calé au dossier ». L'alerte ne vise plus que l'avachi prononcé, d'où la consigne.
POSTURES = [
    ("FORWARD_HEAD", "Avancez la tête vers l'écran, sans bouger le dos"),
    ("TRUNK_FORWARD", "Penchez tout le buste en avant, comme pour lire de près"),
    ("TRUNK_BACKWARD", "Allongez-vous dans la chaise : fesses vers l'avant, dos très en arrière"),
    ("NECK_FLEXION", "Regardez votre téléphone, tenu bas devant vous, sans bouger le dos"),
]
ORANGE, BLANC = (0, 165, 255), (255, 255, 255)


def sans_accents(txt):
    """OpenCV n'affiche pas les accents dans la fenêtre."""
    return unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode()


def programme(duree_posture, duree_retour):
    """Liste des étapes (étiquette, durée en s, consigne) ; ordre des postures tiré au hasard."""
    etapes = [("CALIBRATION", DUREE_CALIBRATION,
               "Installez-vous comme d'habitude, au fond de la chaise, et travaillez normalement")]
    for etiquette, consigne in random.sample(POSTURES, len(POSTURES)):
        etapes.append((etiquette, duree_posture, consigne))
        etapes.append(("GOOD", duree_retour, "Revenez à votre posture normale et continuez à travailler"))
    etapes[-1] = ("GOOD", 30, "Revenez à votre posture normale, puis buvez une gorgée d'eau")
    return etapes


def consigne_fenetre(image, txt, reste):
    """Consigne en gros en bas de l'image, avec le compte à rebours."""
    h, w = image.shape[:2]
    image[h - 70:h] = (image[h - 70:h] * 0.3).astype(image.dtype)
    cv2.putText(image, sans_accents(txt)[:60], (10, h - 42), cv2.FONT_HERSHEY_SIMPLEX, 0.6, BLANC, 1, cv2.LINE_AA)
    cv2.putText(image, f"{reste:.0f} s", (10, h - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.8, ORANGE, 2, cv2.LINE_AA)


def main():
    parser = argparse.ArgumentParser(description="Enregistrement guidé d'un volontaire")
    parser.add_argument("code", help="code du volontaire, ex. P02 (jamais son nom)")
    parser.add_argument("--posture", type=int, default=30, help="durée de chaque posture en s (défaut : 30)")
    parser.add_argument("--retour", type=int, default=15, help="durée du retour à la normale en s (défaut : 15)")
    parser.add_argument("--images-par-s", type=float, default=3, help="cadence (défaut : 3, pour la chauffe)")
    args = parser.parse_args()
    if not re.fullmatch(r"P\d{2}", args.code):
        parser.error("le code doit être de la forme P01, P02… (pas de nom : données personnelles)")

    etapes = programme(args.posture, args.retour)
    cam = ouvrir_camera()
    if not cam.isOpened():
        print("ÉCHEC : impossible d'ouvrir la webcam")
        return
    movenet, cote_stable, completeur = MoveNet(), CoteStable(), Completeur()
    DOSSIER_RESULTATS.mkdir(exist_ok=True)
    chemin = DOSSIER_RESULTATS / f"{args.code}_{datetime.now():%Y-%m-%d_%H%M}.csv"
    duree_totale = sum(d for _, d, _ in etapes)
    print(f"Volontaire {args.code} : {len(etapes)} étapes, {duree_totale // 60} min {duree_totale % 60} s")
    print(f"Ordre des postures : {', '.join(e for e, _, _ in etapes[1::2])}")
    print(f"Mesures : {chemin}   (q dans la fenêtre ou Ctrl+C pour arrêter)")
    temp_debut = temperature_pi()

    ref, calibration, compte = None, [], Counter()
    try:
        with open(chemin, "w", newline="") as f:
            ecrivain = csv.writer(f)
            ecrivain.writerow(COLONNES_CSV)
            for numero, (etiquette, duree, consigne) in enumerate(etapes, 1):
                print(f"\a\n[{numero}/{len(etapes)}] {consigne}  ({duree} s)")
                suivante = etapes[numero][2] if numero < len(etapes) else None
                annoncee = False
                debut = time.monotonic()
                while (reste := duree - (time.monotonic() - debut)) > 0:
                    t_boucle = time.perf_counter()
                    image = capturer(cam)
                    if image is None:
                        print("capture ratée")
                        time.sleep(0.5)
                        continue
                    pts = movenet.points(image)
                    cote = cote_stable.maj(pts)
                    pts_c, complete = completeur.maj(pts, cote)
                    a = angles(pts_c, cote)
                    en_transition = duree - reste < TRANSITION
                    if etiquette == "CALIBRATION" and a and not en_transition:
                        calibration.append(a)
                    ecrit = "TRANSITION" if en_transition else etiquette
                    ecrivain.writerow(ligne_csv(ecrit, pts, cote, a, ref, complete))
                    compte[(ecrit, a is not None)] += 1

                    affichage = image_affichee(image, "flou")
                    dessiner(affichage, pts_c, cote if a else None)
                    texte(affichage, f"{args.code}  etape {numero}/{len(etapes)} : {etiquette}", 0)
                    texte(affichage, f"Tete {a['tete']:.0f}  Tronc {a['tronc']:+.0f}" if a else "UNKNOWN (mal vu)",
                          1, BLANC if a else ORANGE)
                    if suivante and reste <= ANNONCE:
                        if not annoncee:
                            print(f"\a   Dans {ANNONCE} s : {suivante}")
                            annoncee = True
                        consigne_fenetre(affichage, f"Dans {reste:.0f} s : {suivante}", reste)
                    else:
                        consigne_fenetre(affichage, consigne, reste)
                    cv2.imshow("Dos d'ane - enregistrement", affichage)
                    if cv2.waitKey(1) & 0xFF == ord("q"):
                        raise KeyboardInterrupt
                    time.sleep(max(0.0, 1 / args.images_par_s - (time.perf_counter() - t_boucle)))
                f.flush()

                if etiquette == "CALIBRATION":
                    ref = reference(calibration)
                    if ref is None:
                        print("Calibration ratée : personne mal vue pendant 2 min. Vérifier le cadrage.")
                        return
                    print(f"Référence : tête {ref['tete']:.1f}°, tronc {ref['tronc']:+.1f}° ({len(calibration)} images)")
                    if not -15 <= ref["tronc"] <= 25:
                        print("  ⚠ tronc de référence inhabituel : la personne était-elle bien installée ?")
    except KeyboardInterrupt:
        print("\nArrêt demandé.")
    finally:
        cam.release()
        cv2.destroyAllWindows()

    print("\n===== Bilan =====")
    for etiquette in ("CALIBRATION", "GOOD", "FORWARD_HEAD", "TRUNK_FORWARD", "TRUNK_BACKWARD", "NECK_FLEXION",
                      "TRANSITION"):
        vus, total = compte[(etiquette, True)], compte[(etiquette, True)] + compte[(etiquette, False)]
        if total:
            print(f"{etiquette:15s} {total:4d} images, {100 * vus / total:3.0f} % exploitables")
    print(f"Température : {temp_debut} °C → {temperature_pi()} °C")
    print(f"Mesures     : {chemin}")
    print("Puis : python -m outils.evaluer")


if __name__ == "__main__":
    main()

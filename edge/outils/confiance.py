"""Images ignorées et seuil de confiance : pourquoi des images sont-elles ignorées, CONF_MIN est-il bon ?

Lit les CSV de mesures (resultats/P??_*.csv des volontaires et poc_*.csv des sessions) :
- part d'images ignorées, et pourquoi (point mal vu, pas de profil), par posture ;
- part d'images exploitables si l'on changeait le seuil de confiance ;
- précision des points peu sûrs : saut de position par rapport à l'image d'avant, selon leur
  confiance (un point qui saute loin est deviné par MoveNet, donc ses angles sont faux).
Mesuré le 12/10/2026 : 2 % d'images ignorées, 0,20 gardé (à 0,15, les points gagnés sautent
jusqu'à 30 % du tronc : surtout des hanches cachées par le bureau).

Lancer depuis edge/ avec .venv activé :
    python -m outils.confiance                       # volontaires et sessions
    python -m outils.confiance resultats/poc_….csv   # fichiers choisis
"""

import argparse
import csv
import math
from collections import Counter

import numpy as np

from posture.chemins import DOSSIER_RESULTATS
from posture.points import CONF_MIN, COTES

POINTS = ("oreille", "epaule", "hanche")
SEUILS_TESTES = (0.10, 0.15, 0.20, 0.25, 0.30)
TRANCHES = ((0.0, 0.15), (0.15, CONF_MIN), (CONF_MIN, 0.30), (0.30, 1.01))


def charger(chemin):
    """Une entrée par image (transitions exclues) : étiquette, confiances, positions, angles calculés ?"""
    images = []
    with open(chemin, newline="") as f:
        for l in csv.DictReader(f):
            if l["etiquette"] == "TRANSITION":
                continue
            indices = dict(zip(POINTS, COTES[l["cote"]]))
            images.append({"etiquette": l["etiquette"], "vue": bool(l["tete"]),
                           "conf": {n: float(l[f"c{i}"]) for n, i in indices.items()},
                           "pos": {n: (float(l[f"x{i}"]), float(l[f"y{i}"])) for n, i in indices.items()}})
    return images


def main():
    parser = argparse.ArgumentParser(description="Images ignorées et seuil de confiance")
    parser.add_argument("fichiers", nargs="*", help="CSV de mesures (défaut : volontaires et sessions)")
    args = parser.parse_args()
    fichiers = args.fichiers or (sorted(DOSSIER_RESULTATS.glob("P[0-9][0-9]_*.csv"))
                                 + [f for f in sorted(DOSSIER_RESULTATS.glob("poc_*.csv"))
                                    if not f.stem.endswith(("_evenements", "_resumes"))])
    par_fichier = [charger(f) for f in fichiers]
    images = [im for liste in par_fichier for im in liste]
    if not images:
        print("Aucune image : enregistrer d'abord une session ou un volontaire")
        return
    print(f"===== {len(images)} images, {len(fichiers)} fichiers =====")

    ignorees = [im for im in images if not im["vue"]]
    print(f"\nIgnorées : {len(ignorees)} ({100 * len(ignorees) / len(images):.1f} %)")
    causes = Counter()
    for im in ignorees:
        mal_vus = [n for n, c in im["conf"].items() if c < CONF_MIN]
        causes["mal vu : " + " + ".join(mal_vus) if mal_vus else "pas de profil (ou personne absente)"] += 1
    for cause, n in causes.most_common():
        print(f"   {cause:40s} {n:5d}")

    print("\nPart d'images ignorées par étiquette :")
    for etiquette, n in Counter(im["etiquette"] for im in images).most_common():
        perdues = sum(not im["vue"] for im in images if im["etiquette"] == etiquette)
        print(f"   {etiquette:15s} {100 * perdues / n:5.1f} %  ({n} images)")

    print(f"\nImages exploitables selon le seuil (oreille, épaule et hanche ≥ seuil ; actuel {CONF_MIN}) :")
    for seuil in SEUILS_TESTES:
        ok = sum(min(im["conf"].values()) >= seuil for im in images)
        print(f"   {seuil:.2f} : {100 * ok / len(images):5.1f} %")

    print("\nSaut de position d'un point par rapport à l'image d'avant (÷ longueur du tronc), selon sa confiance :")
    sauts = {tranche: [] for tranche in TRANCHES}
    for liste in par_fichier:
        for avant, apres in zip(liste, liste[1:]):
            tronc = math.dist(apres["pos"]["epaule"], apres["pos"]["hanche"]) or 1.0
            for n in POINTS:
                if avant["conf"][n] < 0.30:          # il faut un point fiable sur l'image d'avant
                    continue
                tranche = next(t for t in TRANCHES if t[0] <= apres["conf"][n] < t[1])
                sauts[tranche].append(math.dist(avant["pos"][n], apres["pos"][n]) / tronc)
    for (bas, haut), v in sauts.items():
        if v:
            print(f"   confiance {bas:.2f}–{min(haut, 1):.2f} : saut médian {np.median(v):.3f}, "
                  f"90 % sous {np.percentile(v, 90):.3f}   ({len(v)} points)")


if __name__ == "__main__":
    main()

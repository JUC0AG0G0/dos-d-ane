"""Test T5 : les règles reconnaissent-elles les mauvaises postures ? Score F1.

Lit les enregistrements guidés (resultats/P??_*.csv, faits avec outils/enregistrer.py) et rejoue
les règles de posture.regles (seuils fixes, SEUILS) :
- part d'images exploitables et angles par posture ;
- « penché vers l'avant » (tête en avant, dos penché ou cou penché allumé) : précision, rappel, F1
  au total et par volontaire, meilleurs seuils (optimiste) et, à partir de 2 volontaires, « un volontaire mis
  de côté » (seuils choisis sur les autres, testés sur lui : le chiffre honnête) ;
- cause annoncée : quand la personne est penchée, l'alerte dit-elle la bonne posture ?
- cou penché seul, puis allongé dans la chaise : précision, rappel, F1 (objectif F1 ≥ 0,80).

Une fausse alerte = la règle s'allume en bonne posture (GOOD). Les images TRANSITION et
CALIBRATION ne comptent pas.

Lancer depuis edge/ avec .venv activé :
    python -m outils.evaluer                       # tous les resultats/P??_*.csv
    python -m outils.evaluer resultats/P01_….csv   # fichiers choisis (live_*.csv aussi)
"""

import argparse
import csv
import statistics
from pathlib import Path

import numpy as np

from posture.angles import angle_cou
from posture.chemins import DOSSIER_RESULTATS
from posture.regles import SEUILS, postures

PENCHE = {"FORWARD_HEAD": "Tete en avant", "TRUNK_FORWARD": "Dos penche", "NECK_FLEXION": "Cou penche"}
OBJECTIF_F1 = 0.80
GRILLE = [{**SEUILS, "tete": t, "tronc": c} for t in range(30, 75, 5) for c in range(5, 40, 5)]


def charger(chemin):
    """Renvoie (code, liste de (étiquette, angles ou None)) pour un enregistrement."""
    with open(chemin, newline="") as f:
        lignes = list(csv.DictReader(f))
    images = [(l["etiquette"], angles_ligne(l) if l["tete"] else None)
              for l in lignes if l["etiquette"] not in ("TRANSITION", "CALIBRATION")]
    return Path(chemin).name.split("_")[0], images


def angles_ligne(l):
    """Angles d'une ligne de CSV ; le cou est recalculé depuis les points (absent des anciens CSV)."""
    pts = np.array([[float(l[f"{c}{i}"]) for c in "xyc"] for i in range(17)])
    return {"tete": float(l["tete"]), "tronc": float(l["tronc"]), "cou": angle_cou(pts, l["cote"])}


def penche(a, seuils):
    regles = postures(a, seuils)
    return any(regles[nom][0] for nom in PENCHE.values())


def allonge(a, seuils):
    return postures(a, seuils)["Allonge dans la chaise"][0]


def cou_penche(a, seuils):
    return postures(a, seuils)["Cou penche"][0]


def compter(personnes, mauvaises, regle, seuils=SEUILS):
    """Vrais positifs, faux négatifs, faux positifs d'une règle (mauvaises : étiquettes visées)."""
    vp = fn = fp = 0
    for _, images in personnes:
        for e, a in images:
            if a is None or e not in (*mauvaises, "GOOD"):
                continue
            allumee = regle(a, seuils)
            vp += e in mauvaises and allumee
            fn += e in mauvaises and not allumee
            fp += e == "GOOD" and allumee
    return vp, fn, fp


def f1(vp, fn, fp):
    precision = vp / (vp + fp) if vp + fp else 0.0
    rappel = vp / (vp + fn) if vp + fn else 0.0
    score = 2 * precision * rappel / (precision + rappel) if precision + rappel else 0.0
    return precision, rappel, score


def meilleurs_seuils(personnes):
    return max(GRILLE, key=lambda s: f1(*compter(personnes, PENCHE, penche, s))[2])


def ligne_f1(titre, vp, fn, fp):
    precision, rappel, score = f1(vp, fn, fp)
    verdict = "✅" if score >= OBJECTIF_F1 else "❌"
    print(f"   {titre:50s} précision {precision:.2f}  rappel {rappel:.2f}  F1 {score:.2f} {verdict}")


def main():
    parser = argparse.ArgumentParser(description="T5 : score F1 des règles de posture")
    parser.add_argument("fichiers", nargs="*", help="CSV à évaluer (défaut : resultats/P??_*.csv)")
    args = parser.parse_args()
    fichiers = args.fichiers or sorted(DOSSIER_RESULTATS.glob("P[0-9][0-9]_*.csv"))
    personnes = list(map(charger, fichiers))
    vides = [code for code, images in personnes if not images]
    if vides:      # enregistrement arrêté avant la fin de la calibration
        print(f"Ignorés (aucune image hors calibration) : {', '.join(vides)}")
    personnes = [p for p in personnes if p[1]]
    if not personnes:
        print("Aucun enregistrement à évaluer : lancer d'abord python -m outils.enregistrer P01")
        return

    print(f"===== {len(personnes)} enregistrement(s) =====")
    for code, images in personnes:
        vus = sum(a is not None for _, a in images)
        print(f"{code} : {len(images)} images, {100 * vus / len(images):.0f} % exploitables")

    print("\n===== Angles par posture =====")
    for etiquette in ("GOOD", *PENCHE, "TRUNK_BACKWARD"):
        angles = [a for _, im in personnes for e, a in im if e == etiquette and a]
        if len(angles) >= 2:
            t, c = [a["tete"] for a in angles], [a["tronc"] for a in angles]
            cou = [a["cou"] for a in angles if a["cou"] is not None] or [float("nan")]
            print(f"{etiquette:15s} tête {statistics.mean(t):6.1f}° (± {statistics.pstdev(t):4.1f})   "
                  f"tronc {statistics.mean(c):+6.1f}° (± {statistics.pstdev(c):4.1f})   "
                  f"cou {statistics.mean(cou):+6.1f}° (± {statistics.pstdev(cou):4.1f})   {len(angles)} images")

    s = SEUILS
    etiquettes = {e for _, im in personnes for e, _ in im}
    if etiquettes & set(PENCHE):
        evaluer_penche(personnes)
    if "NECK_FLEXION" in etiquettes:
        print(f"\n===== Cou penché : nez > {s['cou']}° sous l'oreille =====")
        ligne_f1("seuil actuel", *compter(personnes, ("NECK_FLEXION",), cou_penche))
        bonnes = [a for _, im in personnes for e, a in im if e == "GOOD" and a]
        if bonnes:
            print(f"   fausses alertes : {100 * sum(cou_penche(a, SEUILS) for a in bonnes) / len(bonnes):.1f} % "
                  "des images en bonne posture")
    if "TRUNK_BACKWARD" in etiquettes:
        print(f"\n===== Allongé dans la chaise : tronc < {s['allonge']} =====")
        ligne_f1("seuil actuel", *compter(personnes, ("TRUNK_BACKWARD",), allonge))
        bonnes = [a for _, im in personnes for e, a in im if e == "GOOD" and a]
        if bonnes:
            print(f"   fausses alertes : {100 * sum(allonge(a, SEUILS) for a in bonnes) / len(bonnes):.1f} % "
                  "des images en bonne posture")


def evaluer_penche(personnes):
    s = SEUILS
    print(f"\n===== Penché vers l'avant : tête < {s['tete']}, tronc > {s['tronc']} ou cou > {s['cou']} "
          f"(objectif F1 ≥ {OBJECTIF_F1:.2f}) =====")
    ligne_f1("seuils actuels", *compter(personnes, PENCHE, penche))
    if len(personnes) > 1:
        for code, images in personnes:
            ligne_f1(f"   dont {code}", *compter([(code, images)], PENCHE, penche))
    m = meilleurs_seuils(personnes)
    ligne_f1(f"meilleurs seuils : tête < {m['tete']} ou tronc > {m['tronc']} (optimiste)",
             *compter(personnes, PENCHE, penche, m))
    if len(personnes) >= 2:      # seuils choisis sans le volontaire testé, puis appliqués à lui
        total = [0, 0, 0]
        for i, teste in enumerate(personnes):
            mi = meilleurs_seuils(personnes[:i] + personnes[i + 1:])
            total = [t + c for t, c in zip(total, compter([teste], PENCHE, penche, mi))]
        ligne_f1("un volontaire mis de côté", *total)

    print("\n===== Cause annoncée quand la personne est penchée et que l'alerte s'allume =====")
    for etiquette, nom in PENCHE.items():
        allumees = [postures(a) for _, im in personnes for e, a in im if e == etiquette and a and penche(a, SEUILS)]
        if allumees:
            justes = sum(r[nom][0] for r in allumees)
            print(f"   {etiquette:15s} « {nom} » annoncé sur {100 * justes / len(allumees):3.0f} % des {len(allumees)} images en alerte")


if __name__ == "__main__":
    main()

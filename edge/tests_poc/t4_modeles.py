"""Test T4 (début) : MoveNet Lightning ou Thunder, lequel place les points le plus stablement ?

La personne reste assise immobile, de profil. À chaque image, les deux modèles analysent
la MÊME image : on compare le tremblement des points (oreille, épaule, hanche), celui des
angles, la part d'images exploitables et le temps de calcul. Mesure aussi la vitesse (T1).
Aucune image n'est enregistrée ni affichée : seuls des chiffres vont dans resultats/.

Lancer depuis edge/ avec .venv activé :
    python -m tests_poc.t4_modeles               # 1 minute
    python -m tests_poc.t4_modeles --duree 120
Ctrl+C arrête le test et affiche quand même le bilan.
"""

import argparse
import csv
import statistics
import time
from datetime import datetime

from posture_lib import (COTES, CONF_MIN, DOSSIER_EDGE, DOSSIER_RESULTATS, CoteStable, MoveNet, angles,
                         capturer, ouvrir_camera, temperature_pi, throttled_pi)

MODELES = {
    "lightning": DOSSIER_EDGE / "models" / "movenet_lightning_int8.tflite",
    "thunder": DOSSIER_EDGE / "models" / "movenet_thunder_int8.tflite",
}
NOMS_POINTS = ("oreille", "epaule", "hanche")
ANGLES = ("tete", "tronc", "tete_tronc")


def ecart_type(valeurs):
    return statistics.pstdev(valeurs) if len(valeurs) >= 2 else float("nan")


def medianes_par_5(valeurs):
    """Médiane de chaque paquet de 5 mesures : ce que donnerait une rafale de 5 images."""
    return [statistics.median(valeurs[i:i + 5]) for i in range(0, len(valeurs) - 4, 5)]


def bilan(nom, mesures):
    ms = sorted(m["ms"] for m in mesures)
    ok = [m for m in mesures if m["angles"]]
    print(f"\n--- {nom} ({len(mesures)} images) ---")
    if not ms:
        return
    p95 = ms[min(len(ms) - 1, int(0.95 * len(ms)))]
    print(f"Temps IA      : médiane {statistics.median(ms):.0f} ms, 95 % sous {p95:.0f} ms")
    print(f"Exploitables  : {100 * len(ok) / len(mesures):.0f} %")
    for i, point in enumerate(NOMS_POINTS):
        vus = [m["points"][i] for m in mesures if m["points"][i][2] >= CONF_MIN]
        if vus:
            print(f"{point:13s} : tremble de {ecart_type([p[0] for p in vus]):4.1f} px en x, "
                  f"{ecart_type([p[1] for p in vus]):4.1f} px en y, "
                  f"confiance moyenne {statistics.mean(p[2] for p in vus):.2f}")
    for k in ANGLES:
        v = [m["angles"][k] for m in ok]
        if v:
            print(f"{k:13s} : écart-type {ecart_type(v):4.1f}° par image, "
                  f"{ecart_type(medianes_par_5(v)):4.1f}° en médiane de 5 images   (moyenne {statistics.mean(v):.0f}°)")


def main():
    parser = argparse.ArgumentParser(description="T4 : stabilité de MoveNet Lightning et Thunder")
    parser.add_argument("--duree", type=int, default=60, help="durée en secondes (défaut : 60)")
    parser.add_argument("--images-par-s", type=float, default=2, help="cadence (défaut : 2, pour la chauffe)")
    parser.add_argument("--threads", type=int, default=4, help="threads de l'IA (défaut : 4)")
    args = parser.parse_args()

    manquants = [str(c) for c in MODELES.values() if not c.exists()]
    if manquants:
        print("Modèle manquant : " + ", ".join(manquants) + " (voir docs/poc-raspberry.md §3.4)")
        return
    modeles = {nom: MoveNet(chemin, args.threads) for nom, chemin in MODELES.items()}
    cotes = {nom: CoteStable() for nom in MODELES}
    mesures = {nom: [] for nom in MODELES}

    cam = ouvrir_camera()
    if not cam.isOpened():
        print("ÉCHEC : impossible d'ouvrir la webcam")
        return

    DOSSIER_RESULTATS.mkdir(exist_ok=True)
    chemin_csv = DOSSIER_RESULTATS / f"t4_{datetime.now():%Y-%m-%d_%H%M}.csv"
    print(f"T4 : restez assis immobile, de profil, pendant {args.duree} s   (Ctrl+C pour arrêter)")
    print(f"Mesures : {chemin_csv}\n")
    temp_debut = temperature_pi()
    t_debut = time.monotonic()
    try:
        with open(chemin_csv, "w", newline="") as f:
            ecrivain = csv.writer(f)
            ecrivain.writerow(["heure", "modele", "ms", "cote"] + list(ANGLES)
                              + [f"{c}_{p}" for p in NOMS_POINTS for c in ("x", "y", "conf")])
            n = 0
            while time.monotonic() - t_debut < args.duree:
                time.sleep(max(0.0, t_debut + n / args.images_par_s - time.monotonic()))
                n += 1
                image = capturer(cam)
                if image is None:
                    print("capture ratée")
                    continue
                heure = datetime.now().isoformat(timespec="milliseconds")
                for nom, movenet in modeles.items():      # les deux modèles sur la même image
                    t0 = time.perf_counter()
                    pts = movenet.points(image)
                    ms = (time.perf_counter() - t0) * 1000
                    cote = cotes[nom].maj(pts)
                    a = angles(pts, cote)
                    points = [tuple(float(v) for v in pts[i]) for i in COTES[cote]]
                    mesures[nom].append({"ms": ms, "angles": a, "points": points})
                    ecrivain.writerow([heure, nom, f"{ms:.1f}", cote]
                                      + [f"{a[k]:.2f}" if a else "" for k in ANGLES]
                                      + [f"{v:.3f}" for p in points for v in p])
                del image                                # l'image n'est jamais conservée
                f.flush()
                if n % int(10 * args.images_par_s) == 0:  # point d'étape toutes les 10 s
                    print(f"  {time.monotonic() - t_debut:3.0f} s  " + "   ".join(
                        f"{nom} {m[-1]['ms']:.0f} ms" for nom, m in mesures.items()) + f"   {temperature_pi()} °C")
    except KeyboardInterrupt:
        print("\nArrêt demandé.")
    finally:
        cam.release()

    print("\n===== Bilan T4 =====")
    for nom, m in mesures.items():
        bilan(nom, m)
    print(f"\nTempérature   : {temp_debut} °C → {temperature_pi()} °C   Throttled : {throttled_pi()}")
    print(f"Mesures       : {chemin_csv}")
    print("→ Le modèle le plus stable a les plus petits écarts-types, à condition d'être resté immobile.")


if __name__ == "__main__":
    main()

"""Test T2 : la webcam fournit-elle des images sans échec sur la durée ?

Capture une image toutes les 5 s (pendant 1 h par défaut), compte les échecs,
mesure le temps de capture et relève la température du Pi.
Aucune image n'est enregistrée ni affichée : seuls des chiffres vont dans resultats/.

Lancer depuis edge/ avec .venv activé :
    python t2_camera.py --court     # essai de 1 minute
    python t2_camera.py             # test complet de 1 heure
Ctrl+C arrête le test et affiche quand même le bilan.
"""

import argparse
import csv
import statistics
import subprocess
import time
from datetime import datetime
from pathlib import Path

import cv2

LARGEUR, HAUTEUR = 640, 480


def temperature():
    """Température du processeur en °C (None si vcgencmd est absent)."""
    try:
        sortie = subprocess.run(["vcgencmd", "measure_temp"], capture_output=True, text=True).stdout
        return float(sortie.split("=")[1].split("'")[0])
    except (OSError, IndexError, ValueError):
        return None


def throttled():
    """Indicateur de ralentissement / sous-tension du Pi (0x0 = rien à signaler)."""
    try:
        return subprocess.run(["vcgencmd", "get_throttled"], capture_output=True, text=True).stdout.strip().split("=")[1]
    except (OSError, IndexError):
        return "?"


def capturer(cam):
    cam.grab()                            # jette l'image en réserve, prise lors de la capture précédente
    ok, image = cam.read()                # attend une image fraîche
    return image if ok else None


def main():
    parser = argparse.ArgumentParser(description="Test T2 : fiabilité de la webcam")
    parser.add_argument("--duree", type=int, default=3600, help="durée du test en secondes (défaut : 3600)")
    parser.add_argument("--intervalle", type=float, default=5, help="secondes entre deux captures (défaut : 5)")
    parser.add_argument("--camera", type=int, default=0, help="numéro de la webcam (défaut : 0 = /dev/video0)")
    parser.add_argument("--court", action="store_true", help="essai de 1 minute")
    args = parser.parse_args()
    duree = 60 if args.court else args.duree

    cam = cv2.VideoCapture(args.camera, cv2.CAP_V4L2)
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, LARGEUR)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, HAUTEUR)
    # Par défaut la webcam garde 4 images en réserve : après 5 s sans lecture, elles sont
    # périmées. Avec une réserve de 1, capturer() n'a qu'une image à jeter.
    cam.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    if not cam.isOpened():
        print(f"ÉCHEC : impossible d'ouvrir la webcam /dev/video{args.camera}")
        return

    Path("resultats").mkdir(exist_ok=True)
    debut = datetime.now()
    chemin_csv = Path("resultats") / f"t2_{debut:%Y-%m-%d_%H%M}.csv"
    prevu = int(duree // args.intervalle)
    print(f"T2 : 1 capture toutes les {args.intervalle:g} s pendant {duree // 60} min ({prevu} captures)")
    print(f"Mesures : {chemin_csv}   (Ctrl+C pour arrêter)\n")

    temps_ms, echecs, resolutions, temperatures = [], 0, set(), []
    t_debut = time.monotonic()
    n = 0
    try:
        with open(chemin_csv, "w", newline="") as f:
            ecrivain = csv.writer(f)
            ecrivain.writerow(["heure", "numero", "ok", "ms", "largeur", "hauteur", "temp_c"])
            while n < prevu:
                prochaine = t_debut + n * args.intervalle
                time.sleep(max(0.0, prochaine - time.monotonic()))
                n += 1

                t0 = time.perf_counter()
                image = capturer(cam)
                ms = (time.perf_counter() - t0) * 1000
                ok = image is not None and image.size > 0
                h, w = image.shape[:2] if ok else (0, 0)
                del image                 # l'image n'est jamais conservée

                temp = temperature()
                if ok:
                    temps_ms.append(ms)
                    resolutions.add((w, h))
                else:
                    echecs += 1
                    print(f"  {datetime.now():%H:%M:%S}  capture n°{n} RATÉE")
                if temp is not None:
                    temperatures.append(temp)
                ecrivain.writerow([f"{datetime.now():%H:%M:%S}", n, int(ok), f"{ms:.1f}", w, h, temp])
                f.flush()

                if n % 12 == 0:           # un point d'étape par minute (avec 5 s d'intervalle)
                    print(f"  {datetime.now():%H:%M:%S}  {n}/{prevu} captures, {echecs} échec(s), {temp} °C")
    except KeyboardInterrupt:
        print("\nArrêt demandé.")
    finally:
        cam.release()

    print("\n===== Bilan T2 =====")
    print(f"Durée         : {(time.monotonic() - t_debut) / 60:.1f} min")
    print(f"Résolution    : {', '.join(f'{w}×{h}' for w, h in sorted(resolutions)) or 'aucune'}")
    print(f"Captures      : {n}   Échecs : {echecs}")
    if temps_ms:
        temps_ms.sort()
        p95 = temps_ms[min(len(temps_ms) - 1, int(0.95 * len(temps_ms)))]
        print(f"Temps capture : médiane {statistics.median(temps_ms):.0f} ms, 95 % sous {p95:.0f} ms, pire {temps_ms[-1]:.0f} ms")
    if temperatures:
        print(f"Température   : {temperatures[0]:.1f} °C → {temperatures[-1]:.1f} °C (max {max(temperatures):.1f} °C)")
    print(f"Throttled     : {throttled()}")
    print(f"Mesures       : {chemin_csv}")
    print("→ RÉUSSI (0 échec)" if n and echecs == 0 else "→ ÉCHEC (voir les captures ratées)")


if __name__ == "__main__":
    main()

"""État du Raspberry Pi : température et ralentissement."""

import subprocess


def temperature_pi():
    """Température du processeur en °C (None si vcgencmd est absent, par exemple sur un PC)."""
    try:
        sortie = subprocess.run(["vcgencmd", "measure_temp"], capture_output=True, text=True).stdout
        return float(sortie.split("=")[1].split("'")[0])
    except (OSError, IndexError, ValueError):
        return None


def throttled_pi():
    """Indicateur de ralentissement / sous-tension du Pi (0x0 = rien à signaler)."""
    try:
        sortie = subprocess.run(["vcgencmd", "get_throttled"], capture_output=True, text=True).stdout
        return sortie.strip().split("=")[1]
    except (OSError, IndexError):
        return "?"

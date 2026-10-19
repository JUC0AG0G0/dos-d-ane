"""Dossiers du projet edge."""

import os
from pathlib import Path

DOSSIER_EDGE = Path(__file__).resolve().parent.parent
DOSSIER_MODELES = DOSSIER_EDGE / "models"          # modèles .tflite (non commités)
DOSSIER_RESULTATS = DOSSIER_EDGE / "resultats"     # CSV de mesures (non commités : données personnelles)

# Id de l'appareil donné par le serveur au premier login, hors du dépôt (emplacement standard Linux)
DOSSIER_ETAT = Path(os.environ.get("XDG_STATE_HOME") or Path.home() / ".local" / "state") / "dos-dane"
FICHIER_APPAREIL = DOSSIER_ETAT / "appareil"
# File des alertes et résumés pas encore reçus par le serveur (SQLite, posture/serveur.py)
FICHIER_ENVOI = DOSSIER_ETAT / "envoi.sqlite"

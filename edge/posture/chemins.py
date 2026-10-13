"""Dossiers du projet edge."""

from pathlib import Path

DOSSIER_EDGE = Path(__file__).resolve().parent.parent
DOSSIER_MODELES = DOSSIER_EDGE / "models"          # modèles .tflite (non commités)
DOSSIER_RESULTATS = DOSSIER_EDGE / "resultats"     # CSV de mesures (non commités : données personnelles)

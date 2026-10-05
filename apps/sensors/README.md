# Capteurs (Python, Raspberry Pi)

Paquet `dosdane-sensors` : lit les capteurs branchés sur le Raspberry Pi, traite les données localement et envoie des mesures dérivées à l'API (`POST /api/measurements`).

Il tourne **sans Docker** pour rester léger : un environnement virtuel Python et un service systemd. Il n'a aucune dépendance obligatoire (bibliothèque standard uniquement).

## Développer en local

```bash
python3 -m venv .venv
.venv/bin/pip install -e '.[dev]'
.venv/bin/pytest            # tests
.venv/bin/ruff check .      # lint
.venv/bin/ruff format .     # formatage

# Envoyer une mesure simulée au backend local
DOSDANE_SENSOR_API_KEY=change-me-dev-key-0123456789 .venv/bin/dosdane-sensors run --once
```

## Déployer sur un Raspberry Pi

```bash
git clone https://github.com/JUC0AG0G0/dos-d-ane.git
cd dos-d-ane/apps/sensors
sudo ./deploy/install.sh
sudo nano /etc/dosdane/sensors.env      # URL de l'API, clé, capteurs
sudo systemctl restart dosdane-sensors
journalctl -u dosdane-sensors -f
```

`install.sh` accepte aussi une roue (`.whl`) publiée par le CD dans une release GitHub. La mise à jour se fait en relançant le même script.

## Ajouter un capteur

Voir `docs/capteurs.md` à la racine du dépôt. En bref : une classe qui hérite de `dosdane_sensors.Sensor`, déclarée dans le groupe d'entry points `dosdane_sensors.sensors`.

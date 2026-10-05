# Capteurs (Python, Raspberry Pi)

Paquet `dosdane-sensors`, destiné à lire les capteurs branchés sur le Raspberry Pi et à envoyer des mesures à l'API. Pour l'instant c'est un squelette : il lit sa configuration, l'affiche dans les logs et s'arrête.

Il tourne **sans Docker** pour rester léger : un environnement virtuel Python et un service systemd. Il n'a aucune dépendance.

En dev, on utilise Python 3.14 (fixé par `mise.toml`). Sur le Raspberry Pi, le Python du système suffit (3.11 minimum, Raspberry Pi OS Trixie fournit 3.13) : ne pas utiliser de syntaxe postérieure à 3.11 (ruff est réglé sur `py311` pour le signaler).

## Développer en local

```bash
python3 -m venv .venv
.venv/bin/pip install -e '.[dev]'
.venv/bin/ruff check .      # lint
.venv/bin/ruff format .     # formatage
.venv/bin/dosdane-sensors   # lancer
```

Le code est dans `src/dosdane_sensors/` : `main.py` (point d'entrée) et `config.py` (variables d'environnement).

## Déployer sur un Raspberry Pi

```bash
git clone https://github.com/JUC0AG0G0/dos-d-ane.git
cd dos-d-ane/apps/sensors
sudo ./deploy/install.sh
sudo nano /etc/dosdane/sensors.env
sudo systemctl restart dosdane-sensors
journalctl -u dosdane-sensors -f
```

`install.sh` crée un venv dans `/opt/dosdane-sensors`, la configuration dans `/etc/dosdane/sensors.env` et le service `dosdane-sensors`. Pour mettre à jour : `git pull` puis relancer le script.

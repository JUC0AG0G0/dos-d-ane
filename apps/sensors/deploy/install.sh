#!/usr/bin/env bash
# Installe ou met à jour dosdane-sensors sur un Raspberry Pi (Raspberry Pi OS).
#
# Usage : sudo ./install.sh [SOURCE]
#   SOURCE : ce que pip doit installer. Par défaut, le dossier apps/sensors
#   qui contient ce script. Exemples :
#     sudo ./install.sh ./dosdane_sensors-0.0.1-py3-none-any.whl
#     sudo ./install.sh "git+https://github.com/JUC0AG0G0/dos-d-ane.git@main#subdirectory=apps/sensors"
set -euo pipefail

APP_DIR=/opt/dosdane-sensors
CONF_DIR=/etc/dosdane
SERVICE=dosdane-sensors
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="${1:-$SCRIPT_DIR/..}"

if [[ $EUID -ne 0 ]]; then
  echo "À lancer avec sudo." >&2
  exit 1
fi

echo "==> Paquets système"
apt-get update -qq
apt-get install -y -qq python3-venv >/dev/null

echo "==> Utilisateur de service"
if ! id dosdane &>/dev/null; then
  useradd --system --no-create-home --shell /usr/sbin/nologin dosdane
fi
for group in i2c gpio dialout; do
  getent group "$group" >/dev/null || groupadd --system "$group"
done

echo "==> Environnement Python dans $APP_DIR"
mkdir -p "$APP_DIR"
[[ -d "$APP_DIR/venv" ]] || python3 -m venv "$APP_DIR/venv"
"$APP_DIR/venv/bin/pip" install --quiet --upgrade pip
"$APP_DIR/venv/bin/pip" install --quiet --upgrade "$SOURCE"

echo "==> Configuration dans $CONF_DIR"
mkdir -p "$CONF_DIR"
if [[ ! -f "$CONF_DIR/sensors.env" ]]; then
  install -m 600 -o root -g root "$SCRIPT_DIR/sensors.env.example" "$CONF_DIR/sensors.env"
  echo "    $CONF_DIR/sensors.env créé : renseignez-le avant de démarrer le service."
fi

echo "==> Service systemd"
install -m 644 "$SCRIPT_DIR/$SERVICE.service" "/etc/systemd/system/$SERVICE.service"
systemctl daemon-reload
systemctl enable "$SERVICE" >/dev/null
systemctl restart "$SERVICE"

echo "Terminé. Suivre les logs : journalctl -u $SERVICE -f"

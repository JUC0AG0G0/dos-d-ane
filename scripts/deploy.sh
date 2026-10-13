#!/bin/sh
# Lancé sur le serveur par le runner GitHub Actions (job deploy de la CI),
# depuis <dossier>/next qui contient le code et .env.prod. Construit les images
# d'abord : si la compilation échoue, la version en ligne n'est pas touchée.
#   sh next/scripts/deploy.sh <version>
set -eu
cd "$(dirname "$0")/.."
compose() { docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml "$@"; }

APP_VERSION=${1:-prod}
export APP_VERSION
compose build --pull

cd ..
rm -rf previous
[ -d current ] && mv current previous
mv next current
cd current

if ! compose up -d --wait --wait-timeout 300 --remove-orphans; then
  compose ps -a
  compose logs --tail 100 migrate server client
  exit 1
fi
docker image prune -f > /dev/null
echo "✓ Version $APP_VERSION en ligne"

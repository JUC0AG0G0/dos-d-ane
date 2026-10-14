#!/bin/sh
# Lancé sur le serveur par le runner GitHub Actions (job deploy de release.yml),
# depuis <dossier>/next qui contient les fichiers compose et .env.prod (avec
# SERVER_TAG et CLIENT_TAG). Télécharge d'abord les images : si une image
# manque, la version en ligne n'est pas touchée.
#   sh next/scripts/deploy.sh
set -eu
cd "$(dirname "$0")/.."
compose() { docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml "$@"; }

versions=$(grep -E '^(SERVER|CLIENT)_TAG=' .env.prod | tr '\n' ' ')
compose pull --quiet

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
echo "✓ En ligne : $versions"

#!/bin/sh
# Lancé sur le VPS par le runner GitHub Actions (job deploy de la CI),
# depuis <dossier>/next qui contient le code et .env.prod. Construit les images
# d'abord : si la compilation échoue, la version en ligne n'est pas touchée.
# Sauvegarde la base avant de démarrer la nouvelle version (ses migrations
# s'appliquent sur les vraies données).
#   sh next/scripts/deploy.sh <version>
set -eu
cd "$(dirname "$0")/.."
compose() { docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml -f compose.vps.yaml "$@"; }
KEEP_BACKUPS=10

APP_VERSION=${1:-prod}
export APP_VERSION
compose build --pull

# Dump de la base en ligne dans <dossier>/backups, les 10 derniers gardés.
if [ -n "$(compose ps -q --status running db)" ]; then
  mkdir -p ../backups
  file="../backups/$(date +%Y-%m-%d_%H-%M-%S).sql"
  (umask 077; compose exec -T db sh -c 'pg_dump --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$file.tmp")
  mv "$file.tmp" "$file"
  gzip "$file"
  file="$file.gz"
  echo "✓ Base sauvegardée dans $(cd ../backups && pwd)/$(basename "$file")"
  ls -1t ../backups/*.sql.gz | tail -n +$((KEEP_BACKUPS + 1)) | xargs -r rm -f
fi

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
# Seulement les images de ce projet : le VPS en héberge d'autres.
docker image prune -f --filter label=com.docker.compose.project=dos-d-ane > /dev/null
echo "✓ Version $APP_VERSION en ligne"

#!/bin/sh
# Exporte la base de dev en SQL (`task db:dump`) dans dumps/, ignoré par Git,
# avec les médias du stockage S3 local à côté : dumps/<date>.sql et
# dumps/<date>.media.tar.gz (même nom, pour les restaurer ensemble).
# Les fichiers peuvent contenir des données personnelles : ne pas les partager.
# Restauration : task db:restore -- dump (stack lancée) ou task dev:restore.
cd "$(dirname "$0")/.." || exit 1
COMPOSE="docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml"

if [ -z "$($COMPOSE ps -q --status running db)" ]; then
  echo "La base ne tourne pas : lance d'abord task dev."
  exit 1
fi

mkdir -p dumps
name="dumps/$(date +%Y-%m-%d_%H-%M-%S)"
file="$name.sql"
# Écrit dans un fichier temporaire pour ne pas laisser de dump incomplet.
if $COMPOSE exec -T db sh -c 'pg_dump --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$file.tmp"; then
  mv "$file.tmp" "$file"
  printf '\033[32m✓\033[0m Base exportée dans %s (%s)\n' "$file" "$(du -h "$file" | cut -f1)"
else
  rm -f "$file.tmp"
  echo "L'export a échoué."
  exit 1
fi

# Médias : archive du volume du service s3. Le service est arrêté le temps de
# la copie (quelques secondes) pour que l'archive soit cohérente.
media="$name.media.tar.gz"
if [ -z "$($COMPOSE ps -aq s3)" ]; then
  echo "Pas de stockage S3 dans la stack : médias non sauvegardés."
  exit 0
fi
$COMPOSE stop s3 >/dev/null 2>&1
if $COMPOSE run --rm --no-deps -T --entrypoint tar s3 czf - -C /data . > "$media.tmp" 2>/dev/null; then
  mv "$media.tmp" "$media"
  printf '\033[32m✓\033[0m Médias exportés dans %s (%s)\n' "$media" "$(du -h "$media" | cut -f1)"
  status=0
else
  rm -f "$media.tmp"
  echo "L'export des médias a échoué (la base, elle, est exportée)."
  status=1
fi
$COMPOSE up -d --wait s3 >/dev/null 2>&1
exit $status

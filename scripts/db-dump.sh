#!/bin/sh
# Exporte la base de dev en SQL (`task db:dump`) dans dumps/, ignoré par Git.
# Le fichier peut contenir des données personnelles : ne pas le partager.
# Restauration : task db:restore (stack lancée) ou task dev:restore.
cd "$(dirname "$0")/.." || exit 1
COMPOSE="docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml"

if [ -z "$($COMPOSE ps -q --status running db)" ]; then
  echo "La base ne tourne pas : lance d'abord task dev."
  exit 1
fi

mkdir -p dumps
file="dumps/$(date +%Y-%m-%d_%H-%M-%S).sql"
# Écrit dans un fichier temporaire pour ne pas laisser de dump incomplet.
if $COMPOSE exec -T db sh -c 'pg_dump --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$file.tmp"; then
  mv "$file.tmp" "$file"
  printf '\033[32m✓\033[0m Base exportée dans %s (%s)\n' "$file" "$(du -h "$file" | cut -f1)"
else
  rm -f "$file.tmp"
  echo "L'export a échoué."
  exit 1
fi

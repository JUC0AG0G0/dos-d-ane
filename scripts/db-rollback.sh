#!/bin/sh
# Annule des migrations déjà appliquées à la base de dev (`task db:restore`).
#   sans argument : annule la dernière migration appliquée ;
#   avec un nom   : revient à cette migration (elle reste appliquée, les
#                   suivantes sont annulées). Le début du nom suffit s'il est
#                   unique, par ex. 20261008 ou init_entities.
# Prisma n'a pas de migrations « down » : le SQL d'annulation est calculé par
# `prisma migrate diff` entre la base actuelle et les migrations conservées,
# rejouées dans une base temporaire (<base>_shadow). Un dump est fait avant.
# Les fichiers des migrations annulées restent dans prisma/migrations : les
# supprimer ou les modifier, sinon task db:migrate les réappliquera.
cd "$(dirname "$0")/.." || exit 1
COMPOSE="docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml"

for service in db server; do
  if [ -z "$($COMPOSE ps -q --status running $service)" ]; then
    echo "La stack ne tourne pas : lance d'abord task dev."
    exit 1
  fi
done

psql_db() {
  $COMPOSE exec -T db sh -c 'psql -q -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$@"' sh "$@"
}
admin_sql() {
  $COMPOSE exec -T db sh -c 'psql -q -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d postgres' >/dev/null
}

applied=$(psql_db -At -c "SELECT migration_name FROM _prisma_migrations
  WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL ORDER BY migration_name" 2>/dev/null)
if [ -z "$applied" ]; then
  echo "Aucune migration appliquée : rien à annuler."
  exit 0
fi

if [ -z "$1" ]; then
  # Toutes sauf la dernière.
  keep=$(echo "$applied" | sed '$d')
else
  matches=$(echo "$applied" | grep -F -- "$1")
  count=$(echo "$matches" | grep -c .)
  if [ "$count" -eq 0 ]; then
    echo "Aucune migration appliquée ne correspond à « $1 ». Migrations appliquées :"
    echo "$applied" | sed 's/^/  /'
    exit 1
  fi
  if [ "$count" -gt 1 ]; then
    echo "« $1 » correspond à plusieurs migrations, précise le nom :"
    echo "$matches" | sed 's/^/  /'
    exit 1
  fi
  keep=$(echo "$applied" | sed "/^$matches\$/q")
fi
undo=$(echo "$applied" | grep -vxF -- "$keep")
if [ -z "$keep" ]; then
  undo=$applied
fi
if [ -z "$undo" ]; then
  echo "« $matches » est déjà la dernière migration appliquée : rien à annuler."
  exit 0
fi

for name in $keep; do
  if [ ! -f "server/prisma/migrations/$name/migration.sql" ]; then
    echo "La migration $name est appliquée mais absente de server/prisma/migrations : impossible de calculer l'annulation."
    exit 1
  fi
done

echo "Migrations annulées :"
echo "$undo" | sed 's/^/  - /'

# Sauvegarde, au cas où : les colonnes et tables retirées perdent leurs données.
sh scripts/db-dump.sh || exit 1

admin_sql <<'SQL' || { echo "Impossible de créer la base temporaire."; exit 1; }
SET client_min_messages = warning;
\getenv db POSTGRES_DB
\getenv owner POSTGRES_USER
SELECT format('%s_shadow', :'db') AS shadow \gset
DROP DATABASE IF EXISTS :"shadow" WITH (FORCE);
CREATE DATABASE :"shadow" OWNER :"owner";
SQL

# Dans le conteneur du serveur : copie des migrations conservées, puis calcul
# du SQL qui ramène la base actuelle à leur état.
script=$($COMPOSE exec -T -e KEEP="$keep" server sh -c '
  set -e
  dir=$(mktemp -d)
  mkdir "$dir/migrations"
  cp prisma/migrations/migration_lock.toml "$dir/migrations/"
  for name in $KEEP; do cp -r "prisma/migrations/$name" "$dir/migrations/"; done
  if [ -z "$KEEP" ]; then to="--to-empty"; else to="--to-migrations $dir/migrations"; fi
  SHADOW_DATABASE_URL=$(echo "$DATABASE_URL" | sed -E "s#/([^/?]+)(\?|\$)#/\1_shadow\2#") \
    npx prisma migrate diff --from-config-datasource $to --script 2>/dev/null
  rm -rf "$dir"
')
status=$?

admin_sql <<'SQL'
SET client_min_messages = warning;
\getenv db POSTGRES_DB
SELECT format('%s_shadow', :'db') AS shadow \gset
DROP DATABASE IF EXISTS :"shadow" WITH (FORCE);
SQL

if [ $status -ne 0 ]; then
  echo "Le calcul du SQL d'annulation a échoué. La base n'a pas été modifiée."
  exit 1
fi

# Annulation et mise à jour de l'historique Prisma dans une seule transaction.
names=$(echo "$undo" | sed "s/.*/'&'/" | paste -sd, -)
if ! { echo "$script"; echo "DELETE FROM _prisma_migrations WHERE migration_name IN ($names);"; } \
  | psql_db -1 >/dev/null; then
  echo "L'annulation a échoué : la base n'a pas été modifiée. Le dump fait juste avant est dans dumps/."
  exit 1
fi

$COMPOSE restart server >/dev/null 2>&1
printf '\033[32m✓\033[0m Base revenue à %s\n' "$(echo "$keep" | tail -n 1 | grep . || echo 'une base vide')"
echo "Pense à supprimer ou modifier les fichiers des migrations annulées dans server/prisma/migrations."

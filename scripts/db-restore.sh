#!/bin/sh
# Remplace la base de dev par le contenu d'un dump (`task db:restore -- dump`,
# `task dev:restore`). Sans argument, prend le dump le plus récent de dumps/.
# La base est supprimée puis recréée : il ne reste que les données du dump.
cd "$(dirname "$0")/.." || exit 1
COMPOSE="docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml"

file=${1:-$(ls -t dumps/*.sql 2>/dev/null | head -n 1)}
if [ -z "$file" ]; then
  echo "Aucun dump dans dumps/ : crée-en un avec task db:dump ou indique le fichier (task db:restore -- chemin.sql)."
  exit 1
fi
if [ ! -f "$file" ]; then
  echo "Fichier introuvable : $file"
  exit 1
fi
if [ -z "$($COMPOSE ps -q --status running db)" ]; then
  echo "La base ne tourne pas : lance d'abord task dev (ou utilise task dev:restore)."
  exit 1
fi

# psql dans le conteneur, connecté à la base d'administration « postgres ».
admin_sql() {
  $COMPOSE exec -T db sh -c 'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d postgres' >/dev/null
}

echo "Restauration de $file…"
# Repart d'une base vide (FORCE coupe les connexions du serveur).
admin_sql <<'SQL' || { echo "Impossible de recréer la base."; exit 1; }
\getenv db POSTGRES_DB
\getenv owner POSTGRES_USER
DROP DATABASE IF EXISTS :"db" WITH (FORCE);
CREATE DATABASE :"db" OWNER :"owner";
SQL

if ! $COMPOSE exec -T db sh -c 'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < "$file" >/dev/null; then
  echo "Le chargement du dump a échoué : la base est incomplète. Relance task db:restore avec un autre dump."
  exit 1
fi

# Le serveur rouvre ses connexions sur la nouvelle base.
$COMPOSE restart server >/dev/null 2>&1
printf '\033[32m✓\033[0m Base restaurée depuis %s\n' "$file"

#!/bin/sh
# Crée .env.dev depuis .env.dev.example, ou y ajoute les variables du modèle
# qui manquent (sans toucher aux valeurs existantes), et supprime les anciens
# fichiers d'env. Lancé par `task setup` (entrée dans le dossier, git pull, task dev).
#   sh scripts/env.sh --check   # code 1 s'il manque quelque chose
cd "$(dirname "$0")/.." || exit 1

# Fichiers d'env d'anciennes versions du projet, remplacés par .env.dev.
OBSOLETE=".env.development .env.staging .env.production server/.env"
for f in $OBSOLETE; do
  [ -f "$f" ] || continue
  [ "$1" = "--check" ] && exit 1
  rm -f "$f" && echo "Supprimé $f (remplacé par .env.dev)"
done

if [ ! -f .env.dev ]; then
  [ "$1" = "--check" ] && exit 1
  cp .env.dev.example .env.dev && echo "Créé .env.dev"
  exit 0
fi

missing=$(grep -E '^[A-Z_]+=' .env.dev.example | while IFS= read -r line; do
  grep -q "^${line%%=*}=" .env.dev || echo "$line"
done)
[ -z "$missing" ] && exit 0
[ "$1" = "--check" ] && exit 1

printf '\n# Ajouté depuis .env.dev.example\n%s\n' "$missing" >> .env.dev
echo "Ajouté à .env.dev : $(echo "$missing" | cut -d= -f1 | tr '\n' ' ')"

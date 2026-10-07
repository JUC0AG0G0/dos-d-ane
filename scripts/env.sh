#!/bin/sh
# Crée .env.dev depuis .env.dev.example, ou y ajoute les variables du modèle
# qui manquent (sans toucher aux valeurs existantes). Lancé par `task setup`.
#   sh scripts/env.sh --check   # code 1 s'il manque quelque chose
cd "$(dirname "$0")/.." || exit 1

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

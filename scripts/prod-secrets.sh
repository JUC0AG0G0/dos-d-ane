#!/bin/sh
# Vérifie les secrets de production, ou écrit le .env de production.
#   SECRETS='{...}' sh scripts/prod-secrets.sh check
#   SECRETS='{...}' sh scripts/prod-secrets.sh write <fichier>
# SECRETS = ${{ toJSON(secrets) }} dans GitHub Actions.
# Attendus : les variables de .env.prod.example. Celles de compose.prod.yaml
# sans valeur par défaut doivent y être (nouvelle variable = nouveau secret),
# sauf les versions des images (DEPLOY_VARS), fournies par la CI.
set -eu
cd "$(dirname "$0")/.."

: "${SECRETS:?SECRETS manquant}"
example=$(grep -E '^[A-Z0-9_]+=' .env.prod.example | cut -d= -f1 | sort -u)
DEPLOY_VARS='["SERVER_TAG","CLIENT_TAG"]'
compose=$(docker compose -f compose.yaml -f compose.prod.yaml config --variables --format json |
  jq -r --argjson skip "$DEPLOY_VARS" '.[] | select(.Required or .DefaultValue == "") | .Name | select(IN($skip[]) | not)' | sort -u)
secret() { printf '%s' "$SECRETS" | jq -r --arg k "$1" '.[$k] // ""'; }

errors=""
err() { errors="$errors\n  - $1"; }

for k in $compose; do
  echo "$example" | grep -qx "$k" || err "$k est utilisée par compose.prod.yaml : l'ajouter à .env.prod.example"
done
for k in $example; do
  echo "$compose" | grep -qx "$k" || err "$k est dans .env.prod.example mais pas dans compose.prod.yaml"
done

for k in $example; do
  v=$(secret "$k")
  if [ -z "$v" ]; then
    err "secret GitHub $k manquant"
    continue
  fi
  case "$v" in *"'"* | *'
'*) err "$k ne doit contenir ni apostrophe ni retour à la ligne" ;; esac
  case "$k" in
    POSTGRES_*)
      printf '%s' "$v" | grep -Eq '^[A-Za-z0-9._~-]+$' ||
        err "$k : lettres, chiffres et . _ ~ - seulement (URL de la base)" ;;
    JWT_SECRET) [ "${#v}" -ge 32 ] || err "JWT_SECRET : 32 caractères minimum" ;;
    ADMIN_PASSWORD) [ "${#v}" -ge 8 ] || err "ADMIN_PASSWORD : 8 caractères minimum" ;;
  esac
done

if [ -n "$errors" ]; then
  printf "Secrets de production incomplets :%b\n" "$errors" >&2
  exit 1
fi

case "${1:-check}" in
  check) echo "✓ $(echo "$example" | wc -l | tr -d ' ') secrets de production renseignés" ;;
  write)
    out=${2:?fichier de sortie manquant}
    umask 077
    : > "$out"
    for k in $compose; do printf "%s='%s'\n" "$k" "$(secret "$k")" >> "$out"; done ;;
  *) echo "Usage : $0 check | write <fichier>" >&2; exit 2 ;;
esac

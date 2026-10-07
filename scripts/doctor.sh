#!/bin/sh
# Vérifie que l'environnement de développement est prêt.
#   task doctor            # rapport complet
#   sh scripts/doctor.sh --quiet   # problèmes + une ligne de bilan (hook mise)
# Les versions attendues sont lues dans mise.toml : c'est la seule source.
cd "$(dirname "$0")/.." || exit 1

QUIET=0
[ "$1" = "--quiet" ] && QUIET=1
ERRORS=0
WARNINGS=0

ok()   { [ "$QUIET" = 1 ] || printf '  \033[32m✓\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; WARNINGS=$((WARNINGS + 1)); }
fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; ERRORS=$((ERRORS + 1)); }

# Version attendue d'un outil dans mise.toml (ex. "26" pour node).
expected() { sed -n "s/^$1 *= *\"\([^\"]*\)\".*/\1/p" mise.toml | head -n 1; }

# check_version <nom> <version installée> <version attendue>
# La version installée doit commencer par la version attendue (26 -> 26.x.y).
check_version() {
  case "$2" in
    "$3" | "$3".*) ok "$1 $2" ;;
    "") fail "$1 introuvable (attendu $3) : lancer \`mise install\`" ;;
    *) fail "$1 $2 au lieu de $3 : lancer \`mise install\` et activer mise dans le shell" ;;
  esac
}

[ "$QUIET" = 1 ] || echo "Outils"
check_version node "$(node --version 2>/dev/null | sed 's/^v//')" "$(expected node)"
if [ -n "$(expected python)" ]; then
  check_version python "$(python3 --version 2>/dev/null | cut -d' ' -f2)" "$(expected python)"
fi
check_version task "$(task --version 2>/dev/null | grep -oE '[0-9]+(\.[0-9]+)+' | head -n 1)" "$(expected task)"

NPM_VERSION=$(npm --version 2>/dev/null)
case "$NPM_VERSION" in
  "") fail "npm introuvable" ;;
  1[1-9].* | [2-9][0-9].*) ok "npm $NPM_VERSION" ;;
  *) fail "npm $NPM_VERSION trop ancien (11 minimum, fourni avec Node $(expected node))" ;;
esac

if docker compose version >/dev/null 2>&1; then
  ok "docker compose $(docker compose version --short 2>/dev/null)"
else
  warn "docker compose introuvable : nécessaire pour \`task dev\`"
fi

[ "$QUIET" = 1 ] || echo "Projet"
if [ -d server/node_modules ]; then ok "dépendances du serveur installées"
else warn "dépendances du serveur absentes : lancer \`task setup\`"; fi

case "$(git config core.hooksPath 2>/dev/null)" in
  .husky/*) ok "hooks Git (Husky) actifs" ;;
  *) warn "hooks Git (Husky) inactifs : lancer \`task setup\`" ;;
esac

if sh scripts/env.sh --check; then ok ".env.dev à jour"
else warn ".env.dev absent ou incomplet : lancer \`task setup\`"; fi
for f in .env .env.* server/.env*; do
  case "$f" in .env.dev | .env.dev.example | *'*'*) continue ;; esac
  [ -f "$f" ] && warn "$f n'est plus utilisé (tout est dans .env.dev) : rm $f"
done

if [ "$ERRORS" -gt 0 ]; then
  printf '\033[31m✗\033[0m dos-d-ane : %s erreur(s), %s avertissement(s) (détails : task doctor)\n' "$ERRORS" "$WARNINGS"
  # En mode hook, on signale sans faire échouer l'ouverture du terminal.
  [ "$QUIET" = 1 ] && exit 0
  exit 1
fi
if [ "$WARNINGS" -gt 0 ]; then
  echo "dos-d-ane : outils OK, $WARNINGS avertissement(s) (détails : task doctor)"
else
  printf '\033[32m✓\033[0m dos-d-ane : environnement OK\n'
fi

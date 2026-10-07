#!/bin/sh
# Lancé par mise à chaque entrée dans le dossier (hook « enter » de mise.toml).
# Installe les outils manquants, prépare le projet puis affiche le bilan.
# Ne s'arrête jamais en cours de route : le bilan dit ce qui ne va pas.
cd "$(dirname "$0")/.." || exit 0

if [ -n "$(mise ls --missing 2>/dev/null)" ]; then
  echo "dos-d-ane : installation des outils (Node, Python, Task), la première fois prend une minute..."
  mise install || echo "dos-d-ane : mise install a échoué (réseau ?), relancer \`mise install\`"
fi

if command -v task >/dev/null 2>&1; then
  task --silent setup || echo "dos-d-ane : task setup a échoué, relancer \`task setup\` pour voir l'erreur"
fi

sh scripts/doctor.sh --quiet

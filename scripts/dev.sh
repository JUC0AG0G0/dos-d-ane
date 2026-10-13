#!/bin/sh
# Lance la stack de dev en arrière-plan (`task dev`) :
# 1. propose un port libre si un port de .env.dev est déjà pris ;
# 2. affiche seulement le démarrage (images, conteneurs), pas les logs ;
# 3. attend que tout réponde puis affiche les URL.
cd "$(dirname "$0")/.." || exit 1
COMPOSE="docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml"

# Valeur d'une variable de .env.dev (sans évaluer le fichier).
env_value() { sed -n "s/^$1=//p" .env.dev | tail -n 1; }

# Arrête une éventuelle stack déjà lancée, pour qu'elle ne compte pas comme « port pris ».
$COMPOSE down --remove-orphans >/dev/null 2>&1

port_busy() {
  node -e 's=require("net").createServer().once("error",()=>process.exit(0)).once("listening",()=>s.close(()=>process.exit(1))).listen(+process.argv[1])' "$1"
}
free_port() {
  node -e 's=require("net").createServer().listen(0,()=>{console.log(s.address().port);s.close()})'
}

# check_port <variable> <service> : si le port est pris, propose un port libre
# pour ce lancement seulement (.env.dev n'est pas modifié).
check_port() {
  port=$(env_value "$1")
  [ -n "$port" ] && port_busy "$port" || return 0
  printf 'Le port %s (%s) est déjà utilisé. Utiliser un port libre au hasard ? [O/n] ' "$port" "$2"
  read -r answer
  case "$answer" in
    [nN]*) echo "Libère le port $port ou change $1 dans .env.dev."; exit 1 ;;
  esac
  new=$(free_port)
  export "$1=$new"
  echo "  -> $2 sur le port $new"
}
check_port CLIENT_PORT "client web"
check_port PORT "API"
check_port POSTGRES_PORT "PostgreSQL"
check_port PGADMIN_PORT "pgAdmin"

if ! $COMPOSE up -d --wait --wait-timeout 300; then
  echo
  echo "Le démarrage a échoué. Derniers logs du client et du serveur :"
  $COMPOSE logs --tail 30 client server
  exit 1
fi

WEB_PORT=${CLIENT_PORT:-$(env_value CLIENT_PORT)}
API_PORT=${PORT:-$(env_value PORT)}
DB_PORT=${POSTGRES_PORT:-$(env_value POSTGRES_PORT)}
PGA_PORT=${PGADMIN_PORT:-$(env_value PGADMIN_PORT)}
echo
printf '\033[32m✓\033[0m Stack de dev lancée\n'
echo "  Client web  http://localhost:$WEB_PORT"
echo "  API         http://localhost:$API_PORT/api/health"
echo "  Swagger     http://localhost:$API_PORT/api/docs"
echo "  pgAdmin     http://localhost:$PGA_PORT"
echo "  PostgreSQL  localhost:$DB_PORT (base $(env_value POSTGRES_DB), utilisateur $(env_value POSTGRES_USER))"
echo
echo "Logs : task logs · Arrêter : task down (task clean efface aussi les données)"

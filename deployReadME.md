# Déploiement en production

Chaque push sur `develop` (donc chaque PR mergée) déploie l'application sur le VPS, après une CI verte :

1. la CI construit les images, lance la stack de production complète avec des valeurs de test et vérifie que l'API répond à travers nginx ;
2. le job **deploy** de la CI tourne sur un runner GitHub Actions installé sur le VPS : il y écrit `.env.prod` depuis les secrets GitHub, construit les images, sauvegarde la base, puis redémarre la stack (`scripts/deploy.sh`). Si la compilation ou la sauvegarde échoue, la version en ligne n'est pas touchée.

Le VPS héberge d'autres projets derrière **Nginx Proxy Manager** (ports 80 et 443, certificats Let's Encrypt). Dos d'âne ne publie aucun port : son client (nginx, qui sert le front et relaie `/api`) rejoint le réseau Docker du proxy, `reverse-proxy_default` ([compose.vps.yaml](compose.vps.yaml)). L'API, PostgreSQL et le stockage S3 restent dans le réseau interne du projet, pgAdmin et Swagger ne sont pas lancés. Les migrations Prisma sont appliquées automatiquement avant le démarrage de l'API.

## 1. Installer le runner

Sur GitHub : dépôt > **Settings > Actions > Runners > New self-hosted runner**, **Linux x64**. Sur le VPS, en tant que `debian` (comme les runners des autres projets) :

```bash
mkdir -p ~/dos-d-ane/actions-runner && cd ~/dos-d-ane/actions-runner
# Copier ici les lignes « Download » de la page GitHub (curl ... puis tar xzf ...)
./config.sh --url https://github.com/JUC0AG0G0/dos-d-ane --token <JETON_DE_LA_PAGE> \
  --name dos-d-ane-vps-ovh --labels dos-d-ane-vps --unattended
sudo ./svc.sh install debian && sudo ./svc.sh start
sudo install -d -o debian -g debian /opt/dos-d-ane
```

Le runner doit apparaître **Idle** dans Settings > Actions > Runners, avec le label `dos-d-ane-vps`. `debian` doit faire partie du groupe `docker`.

Le dépôt est public : dans **Settings > Actions > General > Approval for running fork pull request workflows**, choisir **Require approval for all external contributors**. Seul le job de déploiement utilise ce runner, mais il a les droits Docker, équivalents à root sur le VPS.

## 2. Renseigner les secrets GitHub

Dépôt > **Settings > Secrets and variables > Actions > New repository secret**. La liste fait foi dans [.env.prod.example](.env.prod.example) : la CI refuse le merge sur `develop` s'il en manque un, ou si une variable est ajoutée à `compose.prod.yaml` sans secret correspondant.

| Secret | Valeur |
| --- | --- |
| `POSTGRES_USER`, `POSTGRES_DB` | ex. `dosdane` |
| `POSTGRES_PASSWORD` | `openssl rand -hex 32` |
| `JWT_SECRET` | `openssl rand -base64 48` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | compte admin créé au premier démarrage (8 caractères minimum) |
| `S3_ACCESS_KEY`, `S3_SECRET_KEY` | identifiants du stockage S3 local des médias : clé en lettres et chiffres, secret `openssl rand -hex 32` |

Aucune valeur n'est générée ni reprise d'un fichier d'exemple.

`POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB` ne sont lus qu'à la création de la base : les changer ensuite ne change pas la base existante (il faut le faire aussi en SQL).

## 3. Protéger `develop`

Dans le ruleset de `develop` (**Settings > Rules > Rulesets**), activer **Require status checks to pass** et ajouter le check **`ci-ok`** : chaque merge part en production.

## 4. Déployer

Merger une PR dans `develop`, ou **Actions > CI > Run workflow** (sur `develop`) pour redéployer.

## 5. Publier le site dans Nginx Proxy Manager

Une fois, après le premier déploiement :

1. DNS : un enregistrement `A` (et `AAAA` si besoin) `dos-d-ane.julescorneille.fr` vers l'IP du VPS.
2. Nginx Proxy Manager > **Hosts > Proxy Hosts > Add Proxy Host** :
   - Domain Names : `dos-d-ane.julescorneille.fr`
   - Scheme `http`, Forward Hostname `dos-d-ane-client-1`, Forward Port `80`
   - **Block Common Exploits** coché
   - **Websockets Support** coché (le Raspberry Pi se connecte en WebSocket sur `/api/devices/ws`)
   - Onglet **SSL** : *Request a new SSL Certificate*, **Force SSL** et **HTTP/2 Support** cochés.

## Exploiter

Sur le VPS, la version en ligne est dans `/opt/dos-d-ane/current` (la précédente dans `/opt/dos-d-ane/previous`) :

```bash
cd /opt/dos-d-ane/current
alias dc='docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml -f compose.vps.yaml'
dc ps
dc logs -f server
```

Sauvegardes : avant chaque déploiement, la base est exportée dans `/opt/dos-d-ane/backups/<date>.sql.gz` (les 10 dernières sont gardées, lisibles par `debian` seulement). Elles contiennent des données personnelles : ne pas les copier hors du VPS sans les chiffrer. Restaurer une sauvegarde :

```bash
dc stop server
gunzip -c ../backups/<date>.sql.gz | dc exec -T db sh -c \
  'dropdb -U "$POSTGRES_USER" --force "$POSTGRES_DB" && createdb -U "$POSTGRES_USER" "$POSTGRES_DB" && psql -q -U "$POSTGRES_USER" "$POSTGRES_DB"'
dc up -d --wait
```

## Limites

- Les médias (stockage S3, volume `dos-d-ane_s3-data`) ne sont pas sauvegardés automatiquement.
- Pas de retour arrière automatique : si la nouvelle version ne démarre pas, le workflow échoue avec les logs ; corriger et re-merger (un revert compris). Une migration déjà appliquée n'est pas annulée : restaurer la sauvegarde si besoin.
- Le runner tourne avec les droits Docker, équivalents à root sur le VPS : ne pas le partager avec d'autres dépôts.

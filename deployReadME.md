# Déploiement en production

Chaque push sur `main` (donc chaque PR mergée) déploie l'application sur le serveur, après une CI verte :

1. la CI construit les images, lance la stack de production complète avec des valeurs de test et vérifie que l'API répond à travers nginx ;
2. le workflow **Déploiement** tourne sur un runner GitHub Actions installé sur le serveur : il y écrit `.env.prod` depuis les secrets GitHub, construit les images puis redémarre la stack (`scripts/deploy.sh`). Si la compilation échoue, la version en ligne n'est pas touchée.

Le serveur étant sur un réseau privé, c'est le runner qui va chercher le travail chez GitHub (connexion sortante en HTTPS) : aucun port n'est à ouvrir vers l'extérieur.

En production, seul nginx est exposé (port 80) : il sert le front et relaie `/api` au serveur. L'API et PostgreSQL restent dans le réseau Docker, pgAdmin et Swagger ne sont pas lancés. Les migrations Prisma sont appliquées automatiquement avant le démarrage de l'API.

## 1. Préparer le serveur Ubuntu

Installer Docker Engine ([doc officielle](https://docs.docker.com/engine/install/ubuntu/)), git et jq :

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl git jq
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Créer l'utilisateur qui fera tourner le runner, autorisé à utiliser Docker, et le dossier de l'application :

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo install -d -o deploy -g deploy /opt/dos-d-ane
```

Pare-feu : n'ouvrir que SSH (pour toi) et HTTP.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
```

## 2. Installer le runner

Sur GitHub : dépôt > **Settings > Actions > Runners > New self-hosted runner**, choisir **Linux** et **x64**. La page affiche les commandes avec la version du runner et un jeton valable une heure.

Sur le serveur, en tant que `deploy` :

```bash
sudo -iu deploy
mkdir actions-runner && cd actions-runner
# Copier ici les lignes « Download » de la page GitHub (curl ... puis tar xzf ...)
./config.sh --url https://github.com/JUC0AG0G0/dos-d-ane --token <JETON_DE_LA_PAGE> \
  --name salle-103 --labels dos-d-ane-prod --unattended
exit
```

L'installer comme service (démarre avec le serveur) :

```bash
cd /home/deploy/actions-runner
sudo ./svc.sh install deploy
sudo ./svc.sh start
sudo ./svc.sh status
```

Le runner doit apparaître **Idle** dans Settings > Actions > Runners, avec le label `dos-d-ane-prod`. Si le réseau de la formation passe par un proxy, le renseigner dans `/home/deploy/actions-runner/.env` (`https_proxy=...`) puis `sudo ./svc.sh stop && sudo ./svc.sh start`.

Le dépôt est public : n'importe qui peut ouvrir une PR depuis un fork. Seul le workflow de déploiement utilise ce runner, mais dans **Settings > Actions > General > Approval for running fork pull request workflows**, choisir **Require approval for all external contributors**, pour qu'aucun code extérieur ne tourne sans ton accord.

## 3. Renseigner les secrets GitHub

Dépôt > **Settings > Secrets and variables > Actions > New repository secret**. La liste fait foi dans [.env.prod.example](.env.prod.example) : la CI refuse le merge sur `main` s'il en manque un, ou si une variable est ajoutée à `compose.prod.yaml` sans secret correspondant.

| Secret | Valeur |
| --- | --- |
| `POSTGRES_USER`, `POSTGRES_DB` | ex. `dosdane` |
| `POSTGRES_PASSWORD` | `openssl rand -hex 32` |
| `JWT_SECRET` | `openssl rand -base64 48` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | compte admin créé au premier démarrage (8 caractères minimum) |

Aucune valeur n'est générée ni reprise d'un fichier d'exemple.

`POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB` ne sont lus qu'à la création de la base : les changer ensuite ne change pas la base existante (il faut le faire aussi en SQL).

## 4. Protéger `main`

Dans le ruleset de `main` (**Settings > Rules > Rulesets**), activer **Require status checks to pass** et ajouter le check **`ci-ok`**. Il regroupe le lint, la compilation, la stack de production et, pour les PR vers `main`, la vérification des secrets.

## 5. Déployer

Merger une PR dans `main`, ou **Actions > Déploiement > Run workflow** (sur `main`) pour redéployer. Le site est ensuite sur `http://<IP du serveur>/` depuis le réseau de la formation.

Sur le serveur, la version en ligne est dans `/opt/dos-d-ane/current` (la précédente dans `/opt/dos-d-ane/previous`) :

```bash
cd /opt/dos-d-ane/current
sudo docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml ps
sudo docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml logs -f server
```

Sauvegarder la base :

```bash
sudo docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml exec db \
  sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > dos-d-ane-$(date +%F).sql
```

## Limites

- **HTTP seulement** : mots de passe et données circulent en clair sur le réseau. Avant de vraies données (RGPD), mettre HTTPS devant nginx.
- Pas de retour arrière automatique : si la nouvelle version ne démarre pas, le workflow échoue avec les logs ; corriger et re-merger (un revert compris).
- Pas de sauvegarde automatique de la base.
- Le runner tourne avec les droits Docker, équivalents à root sur le serveur : ne pas le partager avec d'autres dépôts.

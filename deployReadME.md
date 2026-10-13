# Déploiement en production

Chaque push sur `main` (donc chaque PR mergée) déploie l'application sur le serveur, en SSH, après une CI verte :

1. la CI construit les images, lance la stack de production complète avec des valeurs de test et vérifie que l'API répond à travers nginx ;
2. le workflow **Déploiement** envoie le code au serveur, y écrit `.env.prod` depuis les secrets GitHub, construit les images puis redémarre la stack (`scripts/deploy.sh`). Si la compilation échoue, la version en ligne n'est pas touchée.

En production, seul nginx est exposé (port 80) : il sert le front et relaie `/api` au serveur. L'API et PostgreSQL restent dans le réseau Docker, pgAdmin et Swagger ne sont pas lancés. Les migrations Prisma sont appliquées automatiquement avant le démarrage de l'API.

## 1. Préparer le serveur Ubuntu

Le serveur doit être joignable en SSH depuis Internet (les machines de GitHub Actions s'y connectent). S'il n'est accessible que depuis le réseau de la formation, il faut un [runner auto-hébergé](https://docs.github.com/actions/hosting-your-own-runners) à la place.

Installer Docker Engine ([doc officielle](https://docs.docker.com/engine/install/ubuntu/)) :

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Créer un utilisateur dédié au déploiement, autorisé à utiliser Docker :

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
```

Pare-feu : n'ouvrir que SSH et HTTP.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
```

## 2. Créer la clé SSH de déploiement

Sur ton PC (pas sur le serveur), une clé réservée à GitHub Actions, sans phrase de passe :

```bash
ssh-keygen -t ed25519 -N "" -C "github-actions dos-d-ane" -f dos-d-ane-deploy
```

Autoriser la clé publique sur le serveur :

```bash
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
echo "<contenu de dos-d-ane-deploy.pub>" | sudo tee -a /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys && sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Tester depuis ton PC : `ssh -i dos-d-ane-deploy -p <port> deploy@<hôte> docker ps`.

Récupérer l'empreinte du serveur (elle empêche GitHub de se connecter à un faux serveur) :

```bash
ssh-keyscan -p <port> <hôte>
```

Vérifier qu'elle correspond à celle affichée sur le serveur par `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`.

## 3. Renseigner les secrets GitHub

Dépôt > **Settings > Secrets and variables > Actions > New repository secret**. La liste fait foi dans [.env.prod.example](.env.prod.example) : la CI refuse le merge sur `main` s'il en manque un, ou si une variable est ajoutée à `compose.prod.yaml` sans secret correspondant.

| Secret | Valeur |
| --- | --- |
| `POSTGRES_USER`, `POSTGRES_DB` | ex. `dosdane` |
| `POSTGRES_PASSWORD` | `openssl rand -hex 32` |
| `JWT_SECRET` | `openssl rand -base64 48` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | compte admin créé au premier démarrage (8 caractères minimum) |
| `DEPLOY_HOST` | IP ou nom du serveur |
| `DEPLOY_PORT` | port SSH (`22` par défaut) |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_SSH_KEY` | contenu complet de `dos-d-ane-deploy` (clé privée) |
| `DEPLOY_KNOWN_HOSTS` | sortie de `ssh-keyscan` |

Aucune valeur n'est générée ni reprise d'un fichier d'exemple. Supprimer ensuite la clé privée de ton PC si elle ne sert qu'à GitHub.

`POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB` ne sont lus qu'à la création de la base : les changer ensuite ne change pas la base existante (il faut le faire aussi en SQL).

## 4. Protéger `main`

Dans le ruleset de `main` (**Settings > Rules > Rulesets**), activer **Require status checks to pass** et ajouter le check **`ci-ok`**. Il regroupe le lint, la compilation, la stack de production et, pour les PR vers `main`, la vérification des secrets.

## 5. Déployer

Merger une PR dans `main`, ou **Actions > Déploiement > Run workflow** (sur `main`) pour redéployer. Le site est ensuite sur `http://<hôte>/`.

Sur le serveur, la version en ligne est dans `~/dos-d-ane/current` (la précédente dans `~/dos-d-ane/previous`) :

```bash
cd ~/dos-d-ane/current
docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml ps
docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml logs -f server
```

Sauvegarder la base :

```bash
docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml exec db \
  sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > dos-d-ane-$(date +%F).sql
```

## Limites

- **HTTP seulement** : mots de passe et données circulent en clair. Avant de vraies données (RGPD), mettre HTTPS devant nginx (par exemple Caddy sur le serveur avec un nom de domaine).
- Pas de retour arrière automatique : si la nouvelle version ne démarre pas, le workflow échoue avec les logs ; corriger et re-merger (un revert compris).
- Pas de sauvegarde automatique de la base.

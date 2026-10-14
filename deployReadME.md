# Déploiement en production

`develop` sert de préprod, `main` ne fait que publier et déployer ce qui y a été validé. Rien n'est compilé deux fois : chaque image est étiquetée avec l'empreinte git du dossier de son app (`tree-<empreinte>`), donc une app qui n'a pas changé n'est ni reconstruite ni redéployée.

| Événement | Workflow | Ce qui tourne |
| --- | --- | --- |
| PR vers `develop` | `ci.yml` | lint et compilation des seules apps modifiées ; build Docker (sans publication) seulement si un `Dockerfile`, `nginx.conf` ou un fichier compose change ; `server/ROUTES.md` à jour si un contrôleur ou un DTO change |
| push sur `develop` | `preprod.yml` | build et publication sur GHCR des images dont le contenu a changé, puis stack de production complète lancée depuis ces images et test de `/api/health` à travers nginx |
| PR `develop` → `main` | `release-check.yml` | aucun build : versions à publier (cases à cocher dans la description), préprod verte pour ce commit, images présentes, secrets complets |
| push sur `main` | `release.yml` | les images reçoivent leur version, tag git et release GitHub par app, puis le runner du serveur télécharge les images et redémarre la stack |

Images : `ghcr.io/juc0ag0g0/dos-d-ane-server`, `-server-migrate` et `-client` (onglet **Packages** du dépôt). Les apps sont listées dans [.github/apps.json](.github/apps.json) (dossier, commande de vérification, images, première version), la logique est dans [scripts/release.mjs](scripts/release.mjs).

`edge` (programme du Raspberry Pi) et `desktop` (app Electron) n'ont pas d'image : ils sont vérifiés sur les PR et reçoivent leurs versions, tags et releases de la même façon (`edge-v0.1.0`, `desktop-v0.3.0`), mais ne sont pas déployés sur le serveur. Pour joindre plus tard un installeur ou une archive à leur release, l'ajouter dans le job `publish` de `release.yml`. Une nouvelle app (mobile…) s'ajoute dans `apps.json`.

Le serveur étant sur un réseau privé, c'est le runner qui va chercher le travail chez GitHub (connexion sortante en HTTPS) : aucun port n'est à ouvrir vers l'extérieur.

En production, seul nginx est exposé (port 80) : il sert le front et relaie `/api` au serveur. L'API et PostgreSQL restent dans le réseau Docker, pgAdmin et Swagger ne sont pas lancés. Les migrations Prisma sont appliquées automatiquement avant le démarrage de l'API.

## 1. Préparer le serveur Ubuntu

Installer Docker Engine ([doc officielle](https://docs.docker.com/engine/install/ubuntu/)), git et jq. Le serveur ne compile rien : il télécharge les images depuis `ghcr.io` (connexion HTTPS sortante, comme le runner).

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

## 4. Protéger `develop` et `main`

Dans les rulesets de `develop` et de `main` (**Settings > Rules > Rulesets**), activer **Require status checks to pass** et ajouter le check **`ci-ok`**. Sur `develop`, il regroupe les vérifications des PR ; sur `main`, les versions, la préprod, les images et les secrets.

## 5. Publier une version et déployer

1. Ouvrir une PR de `develop` vers `main`. La CI ajoute à sa description une section **Versions publiées au merge**, avec pour chaque app modifiée depuis sa dernière version :
   - `patch` (cochée par défaut) : correctif ;
   - `minor` : nouvelle fonctionnalité ;
   - `major` : changement incompatible.
2. Cocher la bonne case directement dans la page de la PR (une seule par app). La CI se relance et affiche la version obtenue, par exemple `server : 1.2.0 → 1.3.0`. La toute première version de chaque app est `1.0.0`.
3. Merger. La CI crée les tags (`server-v1.3.0`, `client-v1.0.4`) et les releases GitHub (notes générées depuis les PR, `openapi.json` joint pour le serveur), puis déploie.

Une PR vers `main` qui ne part pas de `develop` est refusée : ses images n'ont pas été testées en préprod.

Le site est ensuite sur `http://<IP du serveur>/` depuis le réseau de la formation. `GET /api/health` renvoie la version du serveur en ligne.

**Redéployer ou revenir en arrière** : **Actions > Release > Run workflow** (sur `main`). Laisser les champs vides redéploie les dernières versions ; indiquer `server` = `1.2.0` (par exemple) remet cette version, sans rien recompiler. Attention aux migrations de base : une ancienne version du serveur ne les annule pas.

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
- Pas de retour arrière automatique : si la nouvelle version ne démarre pas, le workflow échoue avec les logs ; relancer le workflow avec la version précédente (voir plus haut) ou corriger et re-merger.
- Les images de préprod sont gardées par 20 (les plus récentes, par image) ; les images versionnées ne sont jamais supprimées.
- Pas de sauvegarde automatique de la base.
- Le runner tourne avec les droits Docker, équivalents à root sur le serveur : ne pas le partager avec d'autres dépôts.

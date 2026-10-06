# Déploiement et environnements

## Les trois environnements

| Environnement | Branche | Images Docker | Où |
| --- | --- | --- | --- |
| `development` | toute branche | construites en local | poste du développeur |
| `staging` | `develop` | `:staging` et `:sha-<commit>` | PC de la formation (recette) |
| `production` | `main` | `:production`, `:latest` et `:sha-<commit>` | PC de la formation (démo) |

Le même `compose.yaml` (serveur + PostgreSQL) sert partout. Seul le fichier d'environnement change :

```bash
cp .env.staging.example .env.staging     # puis renseigner POSTGRES_PASSWORD
task up ENV=staging                      # = docker compose --env-file .env.staging up -d
```

## Variables d'environnement

### Stack serveur (`.env.<env>`)

| Variable | Secret | Rôle |
| --- | --- | --- |
| `APP_ENV` | non | `development`, `staging` ou `production` |
| `SERVER_PORT` | non | port exposé par le serveur sur la machine |
| `CORS_ORIGINS` | non | origines autorisées à appeler l'API, séparées par des virgules |
| `SWAGGER_ENABLED` | non | `true` pour activer Swagger en production (actif d'office ailleurs) |
| `POSTGRES_USER`, `POSTGRES_DB` | non | compte et base PostgreSQL |
| `POSTGRES_PASSWORD` | **oui** | mot de passe PostgreSQL |
| `IMAGE_REGISTRY`, `IMAGE_TAG` | non | image à utiliser (ex. `staging`, `sha-1a2b3c4`) |

Générer un secret : `openssl rand -hex 32`.

### Serveur hors Docker

`task start` lance le serveur en local et lit `server/.env` (modèle : `server/.env.example`).

## GitHub : environnements, secrets et variables

Dans **Settings → Environments**, créer `staging` et `production`. Pour `production`, activer **Required reviewers** et limiter le déploiement à la branche `main` ; pour `staging`, à `develop`.

### Secrets (dans chaque environnement)

| Nom | Valeur |
| --- | --- |
| `POSTGRES_PASSWORD` | mot de passe de la base de cet environnement (`openssl rand -hex 32`) |
| `DEPLOY_HOST` | adresse IP ou nom du serveur. **S'il est absent, le CD publie les images mais ne déploie pas.** |
| `DEPLOY_USER` | compte SSH utilisé sur le serveur (ex. `deploy`) |
| `DEPLOY_SSH_KEY` | clé privée SSH dédiée au déploiement (`ssh-keygen -t ed25519 -f deploy_key`, contenu de `deploy_key`) |
| `DEPLOY_KNOWN_HOSTS` | empreinte du serveur : sortie de `ssh-keyscan <DEPLOY_HOST>` |

`GITHUB_TOKEN` est fourni automatiquement par GitHub (publication des images sur GHCR) : rien à créer.

### Variables (dans chaque environnement, non secrètes)

| Nom | Exemple |
| --- | --- |
| `SERVER_PORT` | port exposé sur le serveur (défaut `3000`) |
| `CORS_ORIGINS` | URL des clients autorisés à appeler l'API |
| `SWAGGER_ENABLED` | `false` (production) |
| `PUBLIC_URL` | lien affiché dans GitHub après le déploiement |
| `DEPLOY_PATH` | dossier sur le serveur (défaut `/opt/dos-d-ane`) |
| `POSTGRES_USER`, `POSTGRES_DB` | facultatifs (défaut `dosdane`) |

Les secrets ne sont jamais écrits dans le dépôt. Le CD génère le fichier `.env.<env>` sur le runner (droits 600) et le copie sur le serveur.

## Pipeline CD (`.github/workflows/cd.yml`)

1. **image** : construit l'image du serveur et la pousse sur GHCR (`ghcr.io/juc0ag0g0/dos-d-ane-server`).
2. **deploy** : pour `develop` et `main`, se connecte en SSH au serveur de l'environnement, copie `compose.yaml` et le fichier d'environnement, puis lance `docker compose pull && up -d` avec l'image du commit (`sha-…`). Ignoré si `DEPLOY_HOST` n'est pas défini.

Un tag `vX.Y.Z` publie aussi l'image `:X.Y.Z`.

### Préparer le serveur (une fois)

```bash
# Sur le PC serveur (Docker et le plugin compose installés)
sudo useradd -m -G docker deploy
sudo mkdir -p /opt/dos-d-ane && sudo chown deploy: /opt/dos-d-ane
# Ajouter le contenu de deploy_key.pub dans ~deploy/.ssh/authorized_keys
```

Les images GHCR sont privées par défaut. Soit on les rend publiques (page du paquet sur GitHub → *Package settings*), soit on se connecte une fois sur le serveur : `docker login ghcr.io` avec un jeton GitHub limité à `read:packages`.

### Limite connue

Les runners GitHub doivent pouvoir joindre le serveur en SSH. Si les PC de la formation ne sont pas accessibles depuis Internet : installer un **runner auto-hébergé** sur le serveur (le job `deploy` passe alors en `runs-on: self-hosted`), ou déployer à la main avec `task up ENV=staging` (l'image est publiée quoi qu'il arrive).

### Revenir à une version précédente

```bash
# Sur le serveur, dans /opt/dos-d-ane
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=sha-<ancien commit>/' .env.production
docker compose --env-file .env.production up -d
```

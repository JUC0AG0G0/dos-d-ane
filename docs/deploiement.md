# Déploiement et environnements

## Les trois environnements

| Environnement | Branche | Images Docker | Où |
| --- | --- | --- | --- |
| `development` | toute branche | construites en local | poste du développeur |
| `staging` | `develop` | `:staging` et `:sha-<commit>` | PC de la formation (recette) |
| `production` | `main` | `:production`, `:latest` et `:sha-<commit>` | PC de la formation (démo) |

Le même `compose.yaml` sert partout. Seul le fichier d'environnement change :

```bash
cp .env.staging.example .env.staging     # puis renseigner POSTGRES_PASSWORD
APP=staging mise run up                  # = docker compose --env-file .env.staging up -d
```

## Variables d'environnement

### Stack serveur (`.env.<env>`)

| Variable | Secret | Rôle |
| --- | --- | --- |
| `APP_ENV` | non | `development`, `staging` ou `production` |
| `WEB_PORT` | non | port exposé par nginx sur la machine |
| `CORS_ORIGINS` | non | origines autorisées à appeler l'API, séparées par des virgules |
| `SWAGGER_ENABLED` | non | `true` pour activer Swagger en production (actif d'office ailleurs) |
| `POSTGRES_USER`, `POSTGRES_DB` | non | compte et base PostgreSQL |
| `POSTGRES_PASSWORD` | **oui** | mot de passe PostgreSQL |
| `IMAGE_REGISTRY`, `IMAGE_TAG` | non | images à utiliser (ex. `staging`, `sha-1a2b3c4`) |

Générer un secret : `openssl rand -hex 32`.

### Raspberry Pi (`/etc/dosdane/sensors.env`)

| Variable | Rôle |
| --- | --- |
| `DOSDANE_ENV` | environnement visé |
| `DOSDANE_API_URL` | URL de l'API, ex. `http://192.168.1.10:8080/api` |
| `DOSDANE_DEVICE_ID` | identifiant de l'appareil (nom d'hôte par défaut) |

Passer un Raspberry Pi d'un environnement à l'autre : modifier ces valeurs puis `sudo systemctl restart dosdane-sensors`.

### Web et mobile

- Le web n'a aucune variable de build : il appelle `/api` en relatif et nginx redirige vers le backend.
- Le mobile lit `EXPO_PUBLIC_APP_ENV` et `EXPO_PUBLIC_API_URL` au build (`.env` en local, profils de `apps/mobile/eas.json` pour les builds). Ces valeurs sont publiques : jamais de secret dans le mobile.

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
| `WEB_PORT` | `8080` en staging, `80` en production |
| `CORS_ORIGINS` | URL publique du site |
| `SWAGGER_ENABLED` | `false` (production) |
| `PUBLIC_URL` | lien affiché dans GitHub après le déploiement |
| `DEPLOY_PATH` | dossier sur le serveur (défaut `/opt/dos-d-ane`) |
| `POSTGRES_USER`, `POSTGRES_DB` | facultatifs (défaut `dosdane`) |

Les secrets ne sont jamais écrits dans le dépôt. Le CD génère le fichier `.env.<env>` sur le runner (droits 600) et le copie sur le serveur.

## Pipeline CD (`.github/workflows/cd.yml`)

1. **images** : construit `backend` et `web` et les pousse sur GHCR (`ghcr.io/juc0ag0g0/dos-d-ane-<app>`).
2. **deploy** : pour `develop` et `main`, se connecte en SSH au serveur de l'environnement, copie `compose.yaml` et le fichier d'environnement, puis lance `docker compose pull && up -d` avec l'image du commit (`sha-…`). Ignoré si `DEPLOY_HOST` n'est pas défini.
3. **sensors-release** : pour un tag `v*`, construit le paquet Python des capteurs et l'attache à une release GitHub.

### Préparer le serveur (une fois)

```bash
# Sur le PC serveur (Docker et le plugin compose installés)
sudo useradd -m -G docker deploy
sudo mkdir -p /opt/dos-d-ane && sudo chown deploy: /opt/dos-d-ane
# Ajouter le contenu de deploy_key.pub dans ~deploy/.ssh/authorized_keys
```

Les images GHCR sont privées par défaut. Soit on les rend publiques (page du paquet sur GitHub → *Package settings*), soit on se connecte une fois sur le serveur : `docker login ghcr.io` avec un jeton GitHub limité à `read:packages`.

### Limite connue

Les runners GitHub doivent pouvoir joindre le serveur en SSH. Si les PC de la formation ne sont pas accessibles depuis Internet : installer un **runner auto-hébergé** sur le serveur (le job `deploy` passe alors en `runs-on: self-hosted`), ou déployer à la main avec `APP=staging mise run up` (les images sont publiées quoi qu'il arrive).

### Revenir à une version précédente

```bash
# Sur le serveur, dans /opt/dos-d-ane
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=sha-<ancien commit>/' .env.production
docker compose --env-file .env.production up -d
```

## Raspberry Pi

```bash
git clone https://github.com/JUC0AG0G0/dos-d-ane.git
cd dos-d-ane/apps/sensors
sudo ./deploy/install.sh                 # venv dans /opt/dosdane-sensors + service systemd
sudo nano /etc/dosdane/sensors.env
sudo systemctl restart dosdane-sensors
```

## Mobile

- Développement : `npm start` dans `apps/mobile`, puis Expo Go.
- Build installable : `npx eas-cli build --profile staging --platform android` (compte Expo requis).

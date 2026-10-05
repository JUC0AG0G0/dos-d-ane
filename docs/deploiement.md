# Déploiement et environnements

## Les trois environnements

| Environnement | Branche | Images Docker | Où |
| --- | --- | --- | --- |
| `development` | toute branche | construites en local | poste du développeur |
| `staging` | `develop` | `:staging` et `:sha-<commit>` | PC de la formation (recette) |
| `production` | `main` | `:production`, `:latest` et `:sha-<commit>` | PC de la formation (démo) |

Le même `compose.yaml` sert partout. Seul le fichier d'environnement change :

```bash
cp .env.staging.example .env.staging   # puis renseigner les secrets
docker compose --env-file .env.staging up -d
# équivalent : make up ENV=staging
```

## Variables d'environnement

### Stack serveur (`.env.<env>`)

| Variable | Secret | Rôle |
| --- | --- | --- |
| `APP_ENV` | non | `development`, `staging` ou `production` |
| `WEB_PORT` | non | port exposé par nginx sur la machine |
| `CORS_ORIGINS` | non | origines autorisées à appeler l'API, séparées par des virgules |
| `SENSOR_API_KEY` | **oui** | clé partagée avec les Raspberry Pi (16 caractères minimum) |
| `POSTGRES_USER`, `POSTGRES_DB` | non | compte et base PostgreSQL |
| `POSTGRES_PASSWORD` | **oui** | mot de passe PostgreSQL |
| `IMAGE_REGISTRY`, `IMAGE_TAG` | non | images à utiliser (ex. `staging`, `sha-1a2b3c4`) |

Générer un secret : `openssl rand -hex 32`.

### Raspberry Pi (`/etc/dosdane/sensors.env`)

| Variable | Rôle |
| --- | --- |
| `DOSDANE_ENV` | environnement visé |
| `DOSDANE_API_URL` | URL de l'API, ex. `http://192.168.1.10:8080/api` |
| `DOSDANE_SENSOR_API_KEY` | même valeur que `SENSOR_API_KEY` de l'environnement visé |
| `DOSDANE_DEVICE_ID` | identifiant de l'appareil (nom d'hôte par défaut) |
| `DOSDANE_SENSORS` | capteurs à lire, ex. `imu,tof` |
| `DOSDANE_INTERVAL_SECONDS` | intervalle entre deux lectures |

Passer un Raspberry Pi d'un environnement à l'autre : modifier `DOSDANE_ENV`, `DOSDANE_API_URL` et `DOSDANE_SENSOR_API_KEY`, puis `sudo systemctl restart dosdane-sensors`.

### Web et mobile

- Le web n'a aucune variable de build : il appelle `/api` en relatif et nginx redirige vers `API_UPSTREAM`.
- Le mobile lit `EXPO_PUBLIC_APP_ENV` et `EXPO_PUBLIC_API_URL` au build (`.env` en local, profils de `apps/mobile/eas.json` pour les builds). Ces valeurs sont publiques : jamais de secret dans le mobile.

## GitHub : environnements et secrets

Dans **Settings → Environments**, créer `staging` et `production`. Pour `production`, activer **Required reviewers** et limiter les branches de déploiement à `main` ; pour `staging`, à `develop`.

Dans chaque environnement :

| Type | Nom | Exemple / rôle |
| --- | --- | --- |
| Secret | `SENSOR_API_KEY` | clé capteurs de cet environnement |
| Secret | `POSTGRES_PASSWORD` | mot de passe base de cet environnement |
| Secret | `DEPLOY_HOST` | adresse du serveur ; **absent = pas de déploiement** |
| Secret | `DEPLOY_USER` | compte SSH sur le serveur |
| Secret | `DEPLOY_SSH_KEY` | clé privée SSH dédiée au déploiement |
| Secret | `DEPLOY_KNOWN_HOSTS` | sortie de `ssh-keyscan <hôte>` |
| Variable | `WEB_PORT` | `8080` en staging, `80` en production |
| Variable | `CORS_ORIGINS` | URL publique du site |
| Variable | `PUBLIC_URL` | lien affiché dans GitHub après le déploiement |
| Variable | `DEPLOY_PATH` | dossier sur le serveur (défaut `/opt/dos-d-ane`) |

Les secrets ne sont jamais écrits dans le dépôt. Le CD génère le fichier `.env.<env>` sur le runner (droits 600) et le copie sur le serveur.

## Pipeline CD (`.github/workflows/cd.yml`)

1. **images** : construit `backend` et `web`, les pousse sur GHCR (`ghcr.io/juc0ag0g0/dos-d-ane-<app>`).
2. **deploy** : pour `develop` et `main`, se connecte en SSH au serveur de l'environnement, copie `compose.yaml` et le fichier d'environnement, puis lance `docker compose pull && up -d` avec l'image du commit (`sha-…`). Si `DEPLOY_HOST` n'est pas défini, l'étape est ignorée avec un avertissement.
3. **sensors-release** : pour un tag `v*`, construit la roue Python des capteurs et l'attache à une release GitHub.

### Préparer le serveur (une fois)

```bash
# Sur le PC serveur (Docker et le plugin compose installés)
sudo useradd -m -G docker deploy
sudo mkdir -p /opt/dos-d-ane && sudo chown deploy: /opt/dos-d-ane
# Ajouter la clé publique de déploiement dans ~deploy/.ssh/authorized_keys
```

Les images GHCR sont privées par défaut. Soit on les rend publiques (page du paquet sur GitHub → *Package settings*), soit on se connecte une fois sur le serveur : `docker login ghcr.io` avec un jeton GitHub limité à `read:packages`.

### Limite connue

Les runners GitHub doivent pouvoir joindre le serveur en SSH. Si les PC de la formation ne sont pas accessibles depuis Internet, deux options : installer un **runner auto-hébergé** sur le serveur (le job `deploy` passe alors en `runs-on: self-hosted`), ou déployer à la main avec `make up ENV=staging` après le passage du CD (les images sont publiées quoi qu'il arrive).

### Revenir à une version précédente

```bash
# Sur le serveur, dans /opt/dos-d-ane
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=sha-<ancien commit>/' .env.production
docker compose --env-file .env.production up -d
```

## Raspberry Pi

Voir `apps/sensors/README.md`. En résumé :

```bash
cd dos-d-ane/apps/sensors
sudo ./deploy/install.sh                      # ou: sudo ./deploy/install.sh dosdane_sensors-X.Y.Z-py3-none-any.whl
sudo nano /etc/dosdane/sensors.env
sudo systemctl restart dosdane-sensors
```

## Mobile

- Développement : `npm start` dans `apps/mobile`, puis Expo Go.
- Build installable : `npx eas-cli build --profile staging --platform android` (compte Expo requis). Un job de CD EAS pourra être ajouté avec un secret `EXPO_TOKEN`.

# Maintenance

## Opérations courantes sur le serveur

```bash
cd /opt/dos-d-ane
docker compose --env-file .env.production ps          # état des conteneurs (healthy ?)
docker compose --env-file .env.production logs -f     # logs en direct
docker compose --env-file .env.production restart backend
curl -s http://localhost/api/health                   # {"status":"ok","env":"production",...}
```

Depuis une copie du dépôt, les mêmes opérations existent en tâches : `task ps ENV=staging`, `task logs ENV=staging`, `task down ENV=staging`.

Les conteneurs redémarrent seuls (`restart: unless-stopped`) et ont un healthcheck : `docker compose ps` affiche `unhealthy` en cas de problème.

## Raspberry Pi

```bash
systemctl status dosdane-sensors
journalctl -u dosdane-sensors -f        # logs
sudo systemctl restart dosdane-sensors  # après un changement de /etc/dosdane/sensors.env
```

Mise à jour : `git pull` puis relancer `sudo ./deploy/install.sh`.

## Sauvegarde de la base

```bash
# Sauvegarde
docker compose --env-file .env.production exec -T db \
  pg_dump -U dosdane dosdane | gzip > backup-$(date +%F).sql.gz
# Restauration
gunzip -c backup-AAAA-MM-JJ.sql.gz | docker compose --env-file .env.production exec -T db psql -U dosdane dosdane
```

Les données sont dans le volume Docker `dos-d-ane-<env>_db-data`. `docker compose down` les conserve ; `docker compose down -v` les **supprime**.

## Rotation d'un secret

1. Générer une nouvelle valeur (`openssl rand -hex 32`).
2. La mettre à jour dans l'environnement GitHub concerné.
3. Relancer le CD (onglet *Actions* → *CD* → *Run workflow*) ou redéployer à la main.

Attention : changer `POSTGRES_PASSWORD` d'une base existante demande aussi de changer le mot de passe dans PostgreSQL (`ALTER USER dosdane PASSWORD '...'`), car il n'est appliqué qu'à la création du volume.

## Versions des outils

Les versions sont fixées à plusieurs endroits, à changer ensemble :

| Outil | Où |
| --- | --- |
| Node / npm | `mise.toml`, `engines` et `devEngines` des `package.json`, `FROM node:…` des Dockerfile, `compose.dev.yaml` |
| Python | `mise.toml` (dev et CI) ; `requires-python` de `apps/sensors/pyproject.toml` reste à 3.11 pour le Raspberry Pi |
| task | `mise.toml` |
| PostgreSQL | `compose.yaml` (une montée de version majeure demande un `pg_dump` puis une restauration) |

`devEngines` fait refuser `npm install` avec une version de Node ou de npm trop ancienne. `scripts/doctor.sh` lit les versions attendues dans `mise.toml`. Pour le mobile, les versions suivent le SDK Expo : `npx expo install expo@^<version>` puis `npx expo install --fix`.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| `required variable ... is missing a value` | variable absente du fichier `.env.<env>` |
| Backend en boucle de redémarrage, `Configuration invalide` dans les logs | variable invalide (ex. `APP_ENV`) |
| `/api/docs` renvoie 404 en production | normal : mettre `SWAGGER_ENABLED=true` pour l'activer |
| Le web affiche une erreur 502 sur `/api` | backend arrêté ou `unhealthy` : voir les logs |
| `npm error EBADDEVENGINES` | Node ou npm trop ancien : `mise install`, puis vérifier avec `task doctor` |
| Le hook Git échoue avec « task n'est pas installé » | installer mise, puis `mise install` et `task setup` |
| Job `deploy` ignoré dans GitHub Actions | secret `DEPLOY_HOST` absent dans l'environnement |

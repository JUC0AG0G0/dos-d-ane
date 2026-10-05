# Maintenance

## Opérations courantes sur le serveur

```bash
cd /opt/dos-d-ane                       # ou la racine du dépôt en local
make ps ENV=production                  # état des conteneurs (healthy ?)
make logs ENV=production                # logs en direct
docker compose --env-file .env.production restart backend
curl -s http://localhost/api/health     # {"status":"ok","env":"production",...}
```

Les conteneurs redémarrent seuls (`restart: unless-stopped`) et exposent un healthcheck : `docker compose ps` affiche `unhealthy` en cas de problème.

## Raspberry Pi

```bash
systemctl status dosdane-sensors
journalctl -u dosdane-sensors -f        # logs
sudo systemctl restart dosdane-sensors  # après un changement de /etc/dosdane/sensors.env
dosdane-sensors list                    # (dans le venv) capteurs installés
```

Mise à jour : relancer `sudo ./deploy/install.sh` (avec le dépôt à jour ou la nouvelle roue). Si l'API est injoignable, le service garde jusqu'à 1000 mesures en mémoire et les renvoie au retour du réseau.

## Sauvegarde de la base

```bash
# Sauvegarde
docker compose --env-file .env.production exec -T db \
  pg_dump -U dosdane dosdane | gzip > backup-$(date +%F).sql.gz
# Restauration
gunzip -c backup-AAAA-MM-JJ.sql.gz | docker compose --env-file .env.production exec -T db psql -U dosdane dosdane
```

Les données sont dans le volume Docker `dos-d-ane-<env>_db-data`. `make down` les conserve ; `docker compose down -v` les **supprime**.

## Rotation d'un secret

1. Générer une nouvelle valeur (`openssl rand -hex 32`).
2. La mettre à jour dans l'environnement GitHub concerné.
3. Pour `SENSOR_API_KEY`, mettre aussi à jour `/etc/dosdane/sensors.env` sur chaque Raspberry Pi.
4. Relancer le CD (onglet *Actions* → *CD* → *Run workflow*) ou redéployer à la main.

## Mises à jour des dépendances

- **Dependabot** ouvre chaque semaine des PR vers `develop` (npm backend et web, pip, images Docker, actions GitHub). La CI doit être verte avant de fusionner.
- **Mobile** : les versions suivent le SDK Expo. Pour changer de SDK : `npx expo install expo@^<version>` puis `npx expo install --fix`.
- **Node** : la version est fixée à 24 dans les Dockerfile, la CI et `engines` des `package.json` ; la changer partout en même temps.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| `required variable ... is missing a value` | variable absente du fichier `.env.<env>` |
| Backend en boucle de redémarrage, `Configuration invalide` dans les logs | variable invalide (ex. `SENSOR_API_KEY` trop courte) |
| Le web affiche « API indisponible (502) » | backend arrêté ou `unhealthy` : `make logs` |
| Raspberry Pi : `Mesure rejetée par l'API (401)` | clé capteur différente entre le Pi et le serveur |
| Raspberry Pi : `API injoignable` | URL ou réseau ; tester `curl $DOSDANE_API_URL/health` depuis le Pi |
| Job `deploy` ignoré dans GitHub Actions | secret `DEPLOY_HOST` absent dans l'environnement |

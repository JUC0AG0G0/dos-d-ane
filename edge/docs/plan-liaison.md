# Liaison Pi ↔ serveur : le plan

Ce qui est fait et ce qui reste pour que le Raspberry Pi soit piloté depuis l'app et que ses résultats arrivent au serveur. **Comment** ça marche (messages, routes, codes, sécurité) : [liaison-serveur.md](liaison-serveur.md). Expliqué simplement, pour l'oral : [liaison-expliquee.md](liaison-expliquee.md). **Pourquoi** l'architecture (Pi en edge, WebSocket ouverte par le Pi, rien d'identifiant ne sort) : [audit §7.2](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md#72-ce-qui-sort-du-pi--messages-et-transport).

Règle de travail : une petite étape à la fois, testée (sur le vrai Pi quand elle le touche) avant la suivante, un commit par étape, une PR par partie.

Légende : ✅ fait · 🔜 à faire.

## Partie A : liaison temps réel ✅ (PR #35, 19/10/2026)

| Étape | Contenu |
|---|---|
| A1–A3 ✅ | WebSocket `/api/devices/ws` sur le serveur, jeton vérifié à l'ouverture, codes `4401` / `4403` |
| A4 ✅ | client Python (`posture/serveur.py`) : login, `ready`, reconnexion 1 s → 60 s ; testé sur le Pi |
| A5 ✅ | le serveur pilote le Pi : `session:start` / `session:stop`, rattrapage par `ready` |
| A6 ✅ | `poc.py --service` (webcam ouverte seulement pendant une session) et état en direct `state`, validé côté serveur |

## Partie B : fiabilité et sécurité ✅ (branche `feat/envoi-evenements`, 19/10/2026)

| Étape | Contenu | Résultat |
|---|---|---|
| B1 ✅ | tables `postureEvents` / `postureSummaries`, routes `POST`/`GET …/events` et `…/summaries` (idempotentes par `clientId`, acceptées après le stop) ; envoi depuis `poc.py` | CSV du Pi = base |
| B3 ✅ | ids uniques même après un redémarrage ; file d'envoi SQLite sur le Pi (table `rejetes`, purge à 7 jours) | coupure du serveur + redémarrage du Pi : 12 envoyés, 0 perdu, 0 doublon |
| B2 ✅ | clé d'appareil : `POST /devices`, `POST`/`DELETE /devices/:id/key`, `POST /auth/device-login` ; plus aucun mot de passe sur le Pi | révocation pendant que le Pi tourne : coupé tout de suite, arrêt avec un message clair |

## Partie C : que ça marche tout seul, et en vrai 🔜

Dans cet ordre : chaque étape s'appuie sur la précédente.

### C0. WebSocket en prod ✅ (PR #40 ; Pi appairé et recette A + B en prod le 19/10/2026, voir [poc-raspberry.md](poc-raspberry.md) §7)

Aujourd'hui le Pi ne peut se connecter qu'au serveur de dev d'un PC.

- `client/nginx.conf` : relayer `/api/devices/ws` avec les en-têtes `Upgrade` et `Connection` (sinon nginx coupe la WebSocket).
- Nginx Proxy Manager (VPS) : activer « Websockets Support » sur le site.
- Pi : `DOSDANE_SERVEUR=https://<domaine>` (WebSocket en `wss://`, chiffrée), clé créée sur le vrai serveur (`POST /api/devices`).
- **Fini quand** : `python -m outils.connexion` sur le Pi affiche `Liaison OK` avec le serveur du VPS, sans l'avertissement « non chiffrée ».

### C1. Service systemd sur le Pi ✅ (testé en prod le 20/10/2026, voir [poc-raspberry.md](poc-raspberry.md) §3.6 et §7)

Le Pi devient « branché, ça marche » : plus besoin d'un terminal ouvert.

- Unité `dos-dane.service` : `poc.py --service` lancé à l'allumage (après le réseau), relancé s'il s'arrête, `EnvironmentFile=` pour `edge/.env`, utilisateur `uha40` (pas root).
- Arrêt par SIGTERM : déjà géré (dernier résumé, file gardée sur disque).
- Journaux dans `journalctl -u dos-dane` ; fichier de l'unité versionné dans `edge/`, installation décrite dans `poc-raspberry.md`.
- **Fini quand** : après un redémarrage du Pi, une session lancée depuis le site (Swagger est désactivé en prod) démarre l'analyse sans rien toucher sur le Pi ; `systemctl stop` termine proprement.

### C2. État en direct vers l'app (SSE) 🔜

Le serveur reçoit déjà `state` et les alertes, mais personne ne peut encore les voir en direct.

- `GET /api/analysis-sessions/:id/live` (Server-Sent Events, propriétaire de la session seulement) : le dernier `state` puis chaque nouveau, les débuts et fins d'alerte, et la fin de session.
- Authentification : l'app ne peut pas mettre d'en-tête sur un `EventSource` de navigateur → client SSE qui accepte les en-têtes (fetch en flux), ou jeton court dédié ; à trancher, jamais le JWT dans l'URL.
- **Fini quand** : `curl -N -H "Authorization: Bearer …" …/live` affiche les états du Pi en direct pendant une session.

### C3. Le bouton dans l'app 🔜

- Avec Eron (app Expo, branche `mobile`) : choisir le Pi, Démarrer / Terminer (`POST …/start`, `…/stop`), état en direct (C2), puis les résultats (`GET …/events`, `…/summaries`).
- Site, page « Mes Raspberry Pi » : ajouter un Pi (appairage par code, ci-dessous), liste des Pi avec leur état **en ligne / hors ligne**, renommer, révoquer la clé.
- **Fini quand** : une personne lance et termine une session depuis son téléphone, sans Swagger.

#### Appairage par code

Aujourd'hui, aucun bouton ne permet d'ajouter un Pi : il faut lancer `python -m outils.appairer` sur le Pi (email et mot de passe tapés une fois, jamais enregistrés, puis `POST /devices` et la clé écrite dans `edge/.env`). Le but : ajouter un Pi sans script ni mot de passe sur le Pi, même tapé une fois, comme une télé connectée à un compte.

1. Le Pi démarre sans clé (service C1, `DOSDANE_CLE` vide) → il passe en mode appairage.
2. Il demande un code au serveur (ex. `POST /devices/pairing`) : code court (`K7F-29Q`), valable 10 min.
3. L'utilisateur, connecté sur le site, clique sur « Ajouter un Raspberry Pi » et tape le code : le serveur sait ainsi à quel compte rattacher le Pi.
4. Le Pi demande au serveur toutes les 5 s si son code a été validé ; dès que c'est le cas, le serveur crée l'appareil et lui renvoie son `deviceId` et sa clé (une seule fois).
5. Le Pi écrit sa clé dans `edge/.env` et se connecte normalement (`POST /auth/device-login`).

À faire :

- **Serveur** : table de codes temporaires (code, expiration, compte qui l'a validé, nombre d'essais), deux ou trois routes, limite de tentatives (un code court se devine sinon).
- **Pi** : mode appairage au démarrage (un `appairer.py` sans email ni mot de passe).
- **Site** : champ du code dans la page « Mes Raspberry Pi ».

Point à trancher (avec l'équipe) : **le Pi n'a pas d'écran**, comment montrer le code ?

| Piste | Pour | Contre |
|---|---|---|
| Code dans les journaux (`journalctl -u dos-dane`) ou par VNC | rien de plus à coder | il faut quand même aller sur le Pi |
| Le site voit les Pi « en attente » sur le même réseau | rien à taper | compliqué, fragile sur le Wi-Fi de l'UHA (sous-réseaux différents) |
| Code fixe imprimé sur une étiquette collée sur le Pi, créé une fois à l'installation (comme le code d'une box internet) | le plus simple pour l'utilisateur | le code doit être gardé secret comme une clé ; en refaire un si l'étiquette est perdue |

#### Remarques de la recette du 20/10/2026

- Page de session, « Appareils de capture » : le badge « Capture active » vient de `captureStatus` en base, pas de la connexion. Un Pi éteint peut être coché sans avertissement, et la session ne recevra rien. → afficher en ligne / hors ligne d'après les WebSocket ouvertes (`DeviceConnections`).
- Paramètres › Appareils connectés : la WebSocket ne prolonge pas la session de connexion du Pi (seules les requêtes HTTP le font, `SESSION_TTL_MINUTES` = 60). Le Pi risque donc d'être affiché « Expirée » au bout d'1 h alors qu'il est connecté. À vérifier : laisser le Pi connecté plus d'1 h, puis regarder la page ; si c'est le cas, prolonger la session tant que la WebSocket vit.
- Page de session en cours : « Captures 0 » et le bandeau « n'envoie plus rien depuis 5 minutes » alors que le Pi analyse (test C1). Le site compte les captures (`POST …/captures`, points du corps), que le Pi n'envoie jamais en session normale (audit §7.2). → se baser sur la connexion du Pi, ses `state` (C2) et ses alertes.

### C4. Test de bout en bout 🔜

- app → serveur (VPS) → Pi → serveur → app, avec une vraie session de travail (au moins 1 h), et une coupure réseau d'1 h pendant une session (audit §20 : ni perte ni doublon).
- Résultats dans la fiche de [poc-raspberry.md](poc-raspberry.md) §7 (test T6) et dans le rapport.

## À côté (petites PR séparées)

| Sujet | Pourquoi |
|---|---|
| Conteneur de dev sous l'utilisateur, pas root (`compose.dev.yaml`) | sous Linux, fichiers générés en root (`EACCES` à `task check`) et `dist/` partagé qui fait tomber le serveur de dev après un `task check` |
| Mettre Prisma à jour | `npm audit` : 4 vulnérabilités « high » via Prisma 7.10.0 |
| Limite de tentatives sur les logins | aucune aujourd'hui (sans risque pour la clé d'appareil, à prévoir pour le mot de passe) |
| Seuils envoyés par le serveur dans `session:start` | prévu par l'audit §7.1 ; le Pi garde ses seuils fixes en attendant |
| Pi redémarré pendant une coupure | il n'analyse pas tant qu'il n'a pas reçu `ready` ; il pourrait garder sa session en cours sur disque |

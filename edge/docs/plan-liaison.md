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

### C2. État en direct vers l'app (SSE) ✅ (PR #45 et #46, testé en prod le 20/10/2026, voir [poc-raspberry.md](poc-raspberry.md) §7)

Le serveur reçoit déjà `state` et les alertes, mais personne ne peut encore les voir en direct.

- ✅ `GET /api/analysis-sessions/:id/live` (Server-Sent Events, propriétaire de la session seulement) : statut et dernier `state` à l'ouverture, puis chaque `state`, chaque début et fin d'alerte (une fois, même renvoyée), chaque changement de statut ; fermé à l'arrêt ou à la suppression ; `ping` toutes les 30 s. Contrat : [liaison-serveur.md](liaison-serveur.md) §5.
- ✅ Authentification tranchée : `Authorization: Bearer`, comme les autres routes ; côté site et app, lire le flux avec `fetch` ou une librairie qui accepte les en-têtes (`EventSource` ne le permet pas). Pas de jeton court dédié, jamais le JWT dans l'URL.
- Testé en dev avec un Pi simulé (code du Pi) : états reçus dès l'envoi, alerte envoyée 4 fois → 2 messages (début, fin), pause / reprise / arrêt annoncés, flux fermé à l'arrêt.
- **Fini quand** : `curl -N -H "Authorization: Bearer …" …/live` affiche les états du vrai Pi en direct pendant une session **en prod** (à travers les deux nginx). ✅ Vérifié depuis la console du navigateur (`fetch`), après la correction du tampon de Nginx Proxy Manager (#46).
- Ensuite (pas dans C2) : l'afficher sur la page de session du site (et y remplacer « Captures 0 »), puis dans l'app (C3). Site : fait, voir ci-dessous.

### C2 bis. Le direct sur la page de session du site ✅ en dev (branche `feat/live-site`), test en prod 🔜

Page d'une session en cours ou en pause (`LiveView`), seulement si un Raspberry Pi en fait partie : une session avec un téléphone ne change pas.

- Lecture du flux : `http.events()` (`fetch` en flux, jeton dans l'en-tête, `401` → déconnexion comme les autres appels) et le hook `useLiveSession(id)` : statut, dernier état de chaque Pi, alertes ; reconnexion seule (1 s → 30 s) ; arrêt à la fin de la session, sur un refus ou en quittant la page.
- Carte **« En direct »** : couleur (« Tout va bien », « À surveiller », « Alerte », « Image mal vue », « Personne absente »), posture, angles, score, « il y a X s » ; en pause : « webcam éteinte ».
- Carte **« Alertes »** : alertes déjà enregistrées (`GET …/events`) puis reçues en direct, « En cours » puis durée.
- Session avec seulement des Pi : plus de « Captures 0 » (tuile « Alertes » à la place, pas de carte « Dernière capture », pas de « 0 capture » dans les appareils) ; bandeau « n'envoie plus rien depuis 2 minutes » si aucun état n'arrive (`silentPis`), jamais quand c'est le site qui a perdu le flux.
- Testé en dev avec un faux Pi (script qui se comporte comme `poc.py --service`, sans webcam) : états, alertes, pause, reprise, Pi silencieux 2 min puis de retour.
- **Fini quand** : une vraie session du Pi en prod s'affiche en direct sur la page, alertes comprises.
- Reste ailleurs : l'accueil, la liste des sessions et la page d'une session terminée comptent encore les captures (« 0 capture » pour un Pi) et n'affichent ni alertes ni résumés → étape « résultats après la session » (avec C3).
  - ✅ Page d'une session terminée et bilan pendant la session (branche `feat/bilan-pi`, testé en dev le 22/10/2026 avec un Pi simulé qui envoie un résumé toutes les ~26 s) : `GET …/summaries` lu par le site ; tuile **Score** (% du temps suivi en bonne posture, moyenne des résumés pondérée par le temps suivi) et nombre d'alertes à la place de « Captures » ; carte **Bilan** (score, répartition du temps : tout va bien, à surveiller, alerte, image mal vue, absent) ; carte **Score toutes les 5 minutes** (une ligne par Pi) ; carte **Alertes** ; cartes de captures seulement s'il y a un autre appareil. En cours : la carte Bilan « depuis le début », relue toutes les 30 s. Au passage, une couleur `state` inconnue n'efface plus la page (`LiveStateCard`).
  - ✅ Liste des sessions et accueil (branche `feat/resultats-liste`, testé en dev le 22/10/2026) : `score` et `alertCount` dans la liste et le détail des sessions (`alertCount` aussi par appareil), `alerts` dans les chiffres de la semaine ; le site affiche « 78 % · 3 alertes » pour une session avec un Pi (colonne « Résultat » de la liste, survol des appareils, dernières sessions, bandeau de la session en cours), « 1 058 captures » sinon ; tuile « Alertes cette semaine » à la place de « Captures 0 » quand le compte a un Pi et aucune capture dans la semaine ; la tuile « Appareils » ne compte plus les Pi sans clé.

### C3. Le bouton dans l'app 🔜

- Avec Eron (app Expo, branche `mobile`) : choisir le Pi, Démarrer / Terminer (`POST …/start`, `…/stop`), état en direct (C2), puis les résultats (`GET …/events`, `…/summaries`).
- Site, page « Mes Raspberry Pi » : ajouter un Pi (appairage par code, ci-dessous), liste des Pi avec leur état **en ligne / hors ligne** ✅ (ci-dessous), renommer, révoquer la clé.
- **Fini quand** : une personne lance et termine une session depuis son téléphone, sans Swagger.

#### Appairage par code ✅ (PR #49, testé en prod sur le vrai Pi le 20/10/2026, voir [poc-raspberry.md](poc-raspberry.md) §7)

Aujourd'hui, aucun bouton ne permet d'ajouter un Pi : il faut lancer `python -m outils.appairer` sur le Pi, en SSH (email et mot de passe tapés une fois, jamais enregistrés). Le but : l'utilisateur branche le Pi, tape un code dans le site, et c'est tout ; jamais de SSH ni de mot de passe sur le Pi.

**Décidé le 20/10/2026** : le Pi n'a pas d'écran pour afficher un code comme une télé connectée → **code imprimé sur une étiquette collée sur le Pi** (comme le code Wi-Fi d'une box), créé une fois à la préparation. Écartés : code dans les journaux ou par VNC (il faut aller sur le Pi), Pi trouvé sur le réseau local (fragile sur le Wi-Fi de l'UHA, sous-réseaux différents), petit écran (matériel en plus).

Deux rôles :

| Rôle | Qui | SSH |
|---|---|---|
| préparer le Pi, comme un fabricant : système, code, `outils/preparer.py` (crée le code, écrit l'adresse du serveur, active le service C1) | l'équipe, une fois par Pi | oui, une fois |
| l'utiliser : le brancher, taper le code de l'étiquette dans le site (puis l'app), lancer des sessions | l'utilisateur | jamais |

**Réseau** (décidé le 20/10) : préparé à l'avance pour le POC, câble Ethernet ou Wi-Fi rempli à la préparation. Évolution pour le rapport : le Pi sans réseau crée son propre Wi-Fi et une page demande le réseau à rejoindre (comme une Chromecast) ; mise à jour du code sans SSH (le Pi qui se met à jour seul).

Déroulé (contrat exact : [liaison-serveur.md](liaison-serveur.md) §2, « Appairage par code ») :

1. Le Pi démarre **sans clé** (service C1) → au lieu de s'arrêter, il attend : toutes les 5 s, il envoie au serveur son code d'étiquette et son secret de relève.
2. L'utilisateur, connecté sur le site : « Ajouter un Raspberry Pi », code de l'étiquette, nom du Pi → le serveur crée l'appareil **dans ce compte**.
3. À sa demande suivante, le Pi reçoit son `deviceId` et sa clé (une seule fois), les écrit dans `edge/.env` et se connecte comme aujourd'hui (`device-login`, WebSocket).
4. Clé révoquée depuis le site (`4401 Clé révoquée`) → le Pi efface sa clé et **repasse en attente** avec le même code : il peut être donné à quelqu'un d'autre sans SSH.

| Étape | Où | Contenu |
|---|---|---|
| P0 ✅ | doc | ce plan et le contrat |
| P1 ✅ | serveur | table `devicePairings`, `POST /devices/pairing/poll` (Pi), `POST /devices/pairing/claim` (compte), limite d'essais (`@nestjs/throttler`) |
| P2 ✅ | Pi | `poc.py --service` sans clé → attente avec le code ; clé reçue → `edge/.env` ; clé révoquée → retour en attente |
| P3 ✅ | Pi | `outils/preparer.py` : code et secret de relève dans `edge/.env`, adresse du serveur, service activé, texte de l'étiquette |
| P4 ✅ | site | « Ajouter un Raspberry Pi » (code + nom), liste des Pi et révocation de la clé, dans Paramètres › Appareils connectés |

- Testé en dev (20/10/2026) : routes (code inconnu, mal formé, déjà utilisé, autre secret `409`, Pi éteint depuis 3 min `404`, jeton d'un Pi `403`) ; limites (6ᵉ `claim` → `429`, 61ᵉ `poll` en rafale → `429`) ; code du Pi contre le serveur de dev (attente, clé reçue en ~10 s, `.env` en `600`, connexion WebSocket) ; bouton du site avec un Pi neuf simulé ; 134 tests du Pi. En prod sur le vrai Pi : préparé, ajouté par son code, révoqué → retour en attente avec le même code, ré-ajouté.
- Finitions (branche `feat/appairage-finitions`) : la liste des Pi montre l'état de leur clé (`keyStatus` dans `GET /devices` : active, « En attente », « Clé révoquée ») — sans cela, une révocation ne changeait rien à l'écran ; message du Pi quand sa clé est refusée, juste avec ou sans code.
- ✅ Un même Pi n'est plus ajouté deux fois dans un compte (branche `feat/pi-meme-appareil`, testé en dev le 22/10/2026) : chaque ré-appairage créait un nouvel appareil, l'ancien restait « Clé révoquée ». L'appareil garde maintenant l'empreinte de son code : même code + même compte = même appareil (même `deviceId`, nom et historique) ; autre compte = autre appareil. Testé avec un Pi simulé à code fixe : révoqué puis ajouté de nouveau → même appareil, nom gardé ; clé encore valide (Pi qui l'a perdue) → même appareil, ancienne clé refusée (`401`) ; ajouté dans un autre compte → autre appareil ; rendu puis ajouté de nouveau → l'ancien appareil retrouvé.
- Reste (plus tard) : supprimer un Pi de la liste (pas de route `DELETE /devices/:id` : les doublons créés avant ce changement restent affichés).
- Le Pi actuel (le seul) n'est pas réinstallé : `git pull`, puis `preparer.py`, qui ajoute le code et retire l'ancienne clé (copie de `edge/.env` avant) ; résultats, modèle, `.venv` et service ne bougent pas.
- **Fini quand** : le Pi, sans clé, branché, apparaît dans le compte après la saisie du code sur le site, sans SSH ; une session lancée depuis le site marche ; une révocation le remet en attente.

#### Remarques de la recette du 20/10/2026

- Page de session, « Appareils de capture » : le badge « Capture active » veut seulement dire que l'appareil ne capture pas dans une autre session lancée (`openSessionId` null), pas qu'il est connecté. Un Pi éteint peut être coché sans avertissement, et la session ne recevra rien. → afficher en ligne / hors ligne d'après les WebSocket ouvertes (`DeviceConnections`). **Corrigé** (branche `feat/pi-en-ligne`, testé en dev le 22/10/2026, prod 🔜) :
  - serveur : `online` dans `GET /devices` (WebSocket ouverte) ; ping toutes les 30 s, un Pi qui ne répond plus est coupé (faux Pi figé par `kill -STOP` : hors ligne en 56 s) ; ajout à une session refusé (`409`) pour un Pi sans clé (révoquée ou en attente) ou hors ligne, lancement refusé pour un Pi sans clé (hors ligne accepté : `ready` à son retour) ;
  - site : un seul état par Pi (`piState` : En ligne, Hors ligne, En attente, Clé révoquée) dans Nouvelle session, Ajouter un appareil, l'accueil et Paramètres ; un Pi inutilisable est grisé (décochable s'il était déjà coché) ; liste relue toutes les 15 s ;
  - reste à voir en prod : le vrai Pi qui revient « En ligne » seul après une coupure (le faux Pi de test ne se reconnecte pas).
- Paramètres › Appareils connectés : la WebSocket ne prolonge pas la session de connexion du Pi (seules les requêtes HTTP le font : login, ouverture de la WebSocket, POST d'alertes et de résumés ; `SESSION_TTL_MINUTES` = 60). **Constaté en prod le 20/10** : Pi au repos → session « Expirée » au bout d'1 h, alors que la WebSocket reste ouverte (jeton vérifié seulement à l'ouverture) et que le Pi reçoit toujours `session:start`.
  - Aujourd'hui, il revient tout seul, mais seulement au prochain POST : `401` → `jeton.perime()` → `device-login` → nouvelle session → de nouveau dans « Sessions actives » (jusqu'à 5 min après le début d'une analyse, au premier résumé). Trace dans `journalctl -u dos-dane` : `envoi : nouvel essai dans 1 s`, sans `liaison perdue`.
  - Autre effet : « Déconnecter » sur la ligne du Pi révoque sa session mais ne ferme pas sa WebSocket ; seule la révocation de la clé coupe le Pi tout de suite.
  - Pistes : (a) la WebSocket prolonge la session tant qu'elle est ouverte ; (b) le serveur ferme la WebSocket en `4401` quand la session expire ou est révoquée (le Pi refait déjà un login seul, mais (b) seul ajoute une ligne « Expirée » par heure dans l'historique) ; (c) afficher le Pi en ligne / hors ligne d'après la WebSocket. **Retenu à discuter : (a) + (b)**, (b) seulement pour la révocation.
  - **Corrigé** (branche `feat/pi-en-ligne`, testé en dev le 22/10/2026) : (a) chaque `pong` du Pi au ping du serveur (30 s) prolonge sa session, au plus une écriture par minute (faux Pi au repos : session repoussée sans aucune requête) ; (c) fait plus haut. (b) abandonné : un Pi coupé refait un login seul avec sa clé, « Déconnecter » ne servirait à rien. À la place, sur la ligne d'un Pi, « Déconnecter » devient **« Révoquer la clé »** (modale de confirmation, même route que la carte Raspberry Pi), et « Déconnecter les autres appareils » ne ferme plus que les sessions ouvertes par mot de passe (`kind = user`).
- Page de session en cours : « Captures 0 » et le bandeau « n'envoie plus rien depuis 5 minutes » alors que le Pi analyse (test C1). Le site compte les captures (`POST …/captures`, points du corps), que le Pi n'envoie jamais en session normale (audit §7.2). → se baser sur la connexion du Pi, ses `state` (C2) et ses alertes. **Corrigé sur la page de session en cours (C2 bis)** ; reste l'accueil, la liste et la page de fin.

### C4. Test de bout en bout 🔜

- app → serveur (VPS) → Pi → serveur → app, avec une vraie session de travail (au moins 1 h), et une coupure réseau d'1 h pendant une session (audit §20 : ni perte ni doublon).
- Résultats dans la fiche de [poc-raspberry.md](poc-raspberry.md) §7 (test T6) et dans le rapport.

## À côté (petites PR séparées)

| Sujet | Pourquoi |
|---|---|
| Conteneur de dev sous l'utilisateur, pas root (`compose.dev.yaml`) | sous Linux, fichiers générés en root (`EACCES` à `task check`) et `dist/` partagé qui fait tomber le serveur de dev après un `task check` |
| Mettre Prisma à jour | `npm audit` : 4 vulnérabilités « high » via Prisma 7.10.0 |
| ✅ Refuser `POST /auth/login` avec le type `raspberry` (`400`, renvoyer vers `device-login` ; branche `feat/login-sans-raspberry`) | reste d'avant les clés : chaque essai crée un faux Pi sans clé (affiché « Clé révoquée ») avec une session `user` aux pleins droits ; plus aucun Pi ne se connecte par mot de passe |
| Limite de tentatives sur les logins | aucune aujourd'hui (sans risque pour la clé d'appareil, à prévoir pour le mot de passe) |
| Seuils envoyés par le serveur dans `session:start` | prévu par l'audit §7.1 ; le Pi garde ses seuils fixes en attendant |
| Pi redémarré pendant une coupure | il n'analyse pas tant qu'il n'a pas reçu `ready` ; il pourrait garder sa session en cours sur disque |

# Liaison Pi ↔ serveur : le contrat

Ce que le Raspberry Pi et le serveur doivent respecter pour se parler. **Pourquoi** ces choix (WebSocket ouverte par le Pi, POST pour ce qui est stocké, rien d'identifiant ne sort du Pi) : [audit §7.2](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md#72-ce-qui-sort-du-pi--messages-et-transport). Ici, seulement le **comment** ; ce qui est fait et ce qui reste : [plan-liaison.md](plan-liaison.md).

Légende : ✅ en place · 🔜 prévu (étape de la branche `feat/envoi-serveur`).

## 1. Qui passe par où

| Quoi | Sens | Transport | Stocké ? |
|---|---|---|---|
| Commandes `session:start` / `session:stop` ✅ | serveur → Pi | WebSocket | non |
| État en direct `state` ✅ | Pi → serveur | WebSocket | non : dernier état gardé en mémoire, relayé à l'app plus tard (SSE, C2) |
| `heartbeat` 🔜 | Pi → serveur | WebSocket | non |
| Événements (alertes), résumés ✅ | Pi → serveur | HTTPS POST (§4) | oui |

**Ne sort jamais du Pi** : image, pixels, vidéo, **points du corps (keypoints)**, nom ou email de la personne.

## 2. Connexion WebSocket ✅

C'est **le Pi** qui ouvre la connexion, et il la rouvre si elle tombe.

| | |
|---|---|
| Adresse | `ws://<serveur>:3000/api/devices/ws` en dev ; `wss://<domaine>/api/devices/ws` en prod (chiffré) |
| Authentification | header `Authorization: Bearer <accessToken>` |
| Jeton | `accessToken` de `POST /api/auth/device-login` (clé d'appareil, ci-dessous) |
| Taille max d'un message | 16 Ko (au-delà, le serveur coupe la connexion) |

Le jeton passe **toujours dans le header, jamais dans l'URL** (`?token=…`) : les URL sont écrites dans les journaux (nginx, proxys).

Le serveur vérifie le jeton **à l'ouverture**, puis envoie `ready`. **Le Pi attend `ready` avant d'envoyer quoi que ce soit** : avant, ses messages seraient refusés (`Connexion requise`).

### Clé d'appareil ✅

Le Pi n'a **aucun mot de passe** : il a un `deviceId` et une **clé** (`dk_` + 256 bits aléatoires), qu'il échange contre un JWT.

| Route | Qui | Rôle |
|---|---|---|
| `POST /api/devices` | l'utilisateur connecté | « ajouter un Raspberry Pi » : crée l'appareil **avec la capture activée** (il n'a pas d'écran pour l'activer lui-même), renvoie `deviceId` et `key` **une seule fois** |
| `POST /api/devices/:id/key` | le propriétaire | nouvelle clé (perdue, ou Pi existant) ; l'ancienne ne marche plus |
| `DELETE /api/devices/:id/key` | le propriétaire | révoque la clé (Pi perdu, volé, donné) |
| `POST /api/auth/device-login` | public | `{ deviceId, key }` → même réponse qu'un login (`accessToken`) |

- Le serveur ne garde que l'**empreinte SHA-256** de la clé (`devices.keyHash`), comparée en temps constant. Clé fausse ou appareil inconnu : même réponse, `401 Appareil ou clé invalide`.
- Le JWT obtenu expire comme un autre (60 min sans requête) : sur `401` ou `4401`, le Pi refait `device-login` tout seul, sans intervention.
- **Révoquer ou remplacer la clé ferme les sessions du Pi et coupe sa WebSocket tout de suite** (`4401 Clé révoquée`) ; son nouveau login est refusé, il s'arrête avec un message qui dit quoi faire.

**Pourquoi la clé contre un JWT**, et pas la clé dans chaque requête (`Authorization: Device <clé>`, prévu au départ) : les deux suppriment le mot de passe et l'expiration gênante et permettent de révoquer un Pi, mais tout le serveur (guard, révocation, routes qui retrouvent l'appareil par la session) repose sur le JWT et sa session de connexion. Échanger la clé contre un JWT ne change que le login ; la clé circule rarement (un login de temps en temps) et le JWT qui circule est de courte durée et révocable. C'est le schéma classique « secret de longue durée → jeton de courte durée » (client credentials d'OAuth).

### Codes de fermeture

| Code | Raison envoyée | Cause | Ce que fait le Pi |
|---|---|---|---|
| `4401` | Connexion requise | jeton absent, invalide, expiré ou session révoquée | refaire un login, puis se reconnecter |
| `4403` | Réservé aux Raspberry Pi | la session a été ouverte depuis un autre type d'appareil | ne pas réessayer : erreur de configuration |
| `4409` | Remplacée par une autre connexion | le même appareil (même `deviceId`) s'est connecté ailleurs | réessayer plus tard ; si ça se répète, deux Pi utilisent le même `DOSDANE_APPAREIL` |
| `1011` | Erreur du serveur | base injoignable… | réessayer plus tard (attente croissante) |
| autre (`1006`…) | — | réseau coupé, serveur redémarré | réessayer plus tard (attente croissante) |

Attente croissante ✅ : 1 s, doublée à chaque échec jusqu'à 60 s (± 20 % pour que plusieurs Pi ne reviennent pas tous ensemble), remise à 1 s après une connexion réussie. Clé refusée (fausse, révoquée ou remplacée) ou `4403` : le Pi s'arrête et dit pourquoi, réessayer ne servirait à rien. Pendant une coupure, l'état en direct est perdu (le suivant le remplace) ; l'analyse, elle, continue.

## 3. Format des messages WebSocket

Toujours du JSON : `{ "event": "<nom>", "data": <contenu> }`. Un message qui n'est pas du JSON valide, ou dont l'`event` est inconnu, est ignoré.

Erreur renvoyée par le serveur : `{ "event": "exception", "data": { "status": "error", "message": "…" } }`.

| `event` | Sens | `data` | État |
|---|---|---|---|
| `ready` | serveur → Pi | `{ "deviceId": "<uuid>", "sessionId": "<uuid>" \| null }` | ✅ connexion acceptée ; toujours le premier message |
| `ping` → `pong` | Pi → serveur → Pi | n'importe quoi, renvoyé tel quel | ✅ test de la liaison |
| `session:start` | serveur → Pi | `{ "sessionId": "<uuid>" }` (seuils plus tard) | ✅ |
| `session:stop` | serveur → Pi | `{ "sessionId": "<uuid>" }` | ✅ |
| `state` | Pi → serveur | voir ci-dessous | ✅ |
| `heartbeat` | Pi → serveur | température, version, état de la caméra | 🔜 |

### Sessions : la base fait foi

`sessionId` de `ready` = la session d'analyse **en cours** (lancée, ni en pause ni terminée) à laquelle l'appareil participe (`null` sinon). Le Pi s'y aligne à chaque connexion : un Pi éteint ou déconnecté pendant un start ou un stop se remet à jour tout seul, sans file d'attente côté serveur. Ensuite, le serveur envoie :

| Action (REST, app ou site) | Message aux Pi de la session |
|---|---|
| `POST /analysis-sessions/:id/start` | `session:start` |
| `POST /analysis-sessions/:id/stop` | `session:stop` |
| `POST /analysis-sessions/:id/pause` | `session:stop` : le Pi termine son analyse et **éteint la webcam** |
| `POST /analysis-sessions/:id/resume` | `session:start` : le Pi relance une analyse (nouveaux ids, nouveaux CSV) |
| `POST /analysis-sessions/:id/devices` sur une session en cours | `session:start` au Pi ajouté |
| `DELETE /analysis-sessions/:id/devices/:deviceId` sur une session en cours | `session:stop` au Pi retiré |
| `DELETE /analysis-sessions/:id` sur une session en cours | `session:stop` |

Le Pi compare toujours avec ce qu'il fait déjà (`commande()` dans `posture/serveur.py`) : un message répété ne change rien, un `session:stop` d'une autre session est ignoré. **Une coupure de la liaison n'arrête pas la session** : le Pi continue d'analyser, et `ready` lui dit à la reconnexion si elle a été arrêtée entre-temps.

### `state` : l'état en direct

Envoyé à chaque image analysée (toutes les 2 à 30 s selon la cadence), seulement pendant une session. **Jamais stocké** : le serveur garde le dernier état de chaque session en mémoire, l'oublie au `stop`, et le relaiera à l'app (SSE, étape C2).

```json
{ "event": "state", "data": { "sessionId": "<uuid>", "at": "2026-10-19T09:24:30Z", "color": "red",
  "posture": "TRUNK_FORWARD", "headAngle": 63.0, "trunkAngle": 28.0, "score": 17 } }
```

| Champ | Valeurs |
|---|---|
| `sessionId` | la session en cours de cet appareil (sinon refusé : `Session pas en cours pour cet appareil`) |
| `at` | heure de l'image sur le Pi, ISO 8601 en UTC (horloge du Pi synchronisée par NTP ; le serveur note aussi sa propre heure de réception) |
| `color` | couleur de l'alerte en cours : `green`, `orange` (en doute), `red` (alerte) ; `ignored` (image mal vue), `absent` (personne) |
| `posture` | posture de l'image : `GOOD`, `FORWARD_HEAD` (tête en avant ou baissée, regroupées), `TRUNK_FORWARD`, `TRUNK_BACKWARD` ; `null` si l'image n'est pas jugée |
| `headAngle`, `trunkAngle` | degrés, à 0,1 près ; `null` si l'image n'est pas jugée (sens des angles : [algo-posture.md](algo-posture.md)) |
| `score` | % du temps en bonne posture sur la période de résumé en cours (0–100), `null` tant que rien n'est suivi |

Validé côté serveur (`LiveStateDto`) : un champ manquant, une valeur inconnue ou **un champ en plus** (points du corps…) font refuser le message (`{"event":"exception","data":{"message":"Message invalide","details":[…]}}`), sans rien journaliser côté serveur. Plus d'un état par 0,5 s et par appareil : les suivants sont ignorés.

## 4. Événements et résumés (HTTPS POST) ✅

Ce qui est **stocké** passe par le REST classique (Swagger : `analysis-sessions`), avec le même jeton que la WebSocket : `Authorization: Bearer <accessToken>`. Tables : `postureEvents`, `postureSummaries` ([`databaseSchema.dbml`](../../databaseSchema.dbml)).

| Route | Corps | Rôle |
|---|---|---|
| `POST /api/analysis-sessions/:id/events` | `clientId`, `type`, `phase` (`start` ou `end`), `startedAt`, `endedAt` (pour `end`), `headAngleAvg`, `trunkAngleAvg`, `causes` | `start` crée l'alerte, `end` la complète |
| `POST /api/analysis-sessions/:id/summaries` | `clientId`, `periodStart`, `periodEnd`, `score`, `secondsGreen`, `secondsOrange`, `secondsRed`, `secondsIgnored`, `secondsAbsent` | résumé d'une période (5 min) |
| `GET /api/analysis-sessions/:id/events` et `/summaries` | — | lecture (app, site), dans l'ordre |

```json
{ "clientId": "evt_20261019112342_0001", "type": "TRUNK_FORWARD", "phase": "end", "startedAt": "2026-10-19T09:24:28Z",
  "endedAt": "2026-10-19T09:27:40Z", "headAngleAvg": 61.5, "trunkAngleAvg": 24.2,
  "causes": { "TRUNK_FORWARD": 83, "NECK_FLEXION": 17 } }
```

- **Une alerte = une ligne**, avec le **même `clientId` au début et à la fin**. `type` : `FORWARD_HEAD` (tête en avant ou baissée), `TRUNK_FORWARD`, `TRUNK_BACKWARD`, `IMMOBILE` (assis trop longtemps, sans angles). `causes` : part de chaque cause en % (`FORWARD_HEAD`, `NECK_FLEXION`, `TRUNK_FORWARD`, `TRUNK_BACKWARD`). Une fin dont le début s'est perdu crée l'alerte. `endedAt` reste `null` si le Pi s'arrête avant la fin.
- **Idempotent** : `clientId` est unique par appareil et par session. Le même message renvoyé (après une coupure, une réponse perdue) répond 201 avec la ligne déjà enregistrée, sans doublon. Le Pi peut donc renvoyer tant qu'il n'a pas eu de réponse 2xx. Le Pi le forme ainsi : `evt_<début de l'analyse, AAAAMMJJHHMMSS>_0001` (`res_…` pour les résumés) ; l'heure de début évite qu'une analyse relancée pendant la même session (service redémarré) réutilise `evt_…_0001`, qui serait pris pour un renvoi et ignoré.
- **Accepté aussi sur une session terminée**, si l'appareil y a participé : un Pi coupé du réseau au moment du `stop` envoie ses derniers résultats après coup.
- **Côté Pi** (`Envoi` dans `posture/serveur.py`, utilisé par `poc.py --service`) : les messages partent dans l'ordre, dans un thread à part (l'analyse n'attend jamais) ; un échec est renvoyé (attente 1 s → 60 s), un `401` refait le login (jeton partagé avec la WebSocket : un 2ᵉ login révoquerait le 1ᵉʳ), un refus `4xx` est écrit dans le journal sans être renvoyé. À l'arrêt, il réessaie encore 15 s au plus. **File sur disque** (SQLite, `~/.local/state/dos-dane/envoi.sqlite`, dossier réservé à l'utilisateur) : chaque message est écrit avant d'être envoyé et n'est effacé qu'après un 2xx ; ce qui reste à l'arrêt (serveur injoignable, Pi éteint) part au démarrage suivant, en premier. Les refus `4xx` sont rangés dans la table `rejetes` du même fichier, avec le code et la raison (`sqlite3 ~/.local/state/dos-dane/envoi.sqlite "SELECT * FROM rejetes"`). Messages et refus de plus de **7 jours** sont purgés (au démarrage puis toutes les heures, écrit dans le journal), comme le prévoit l'audit §12. Les CSV de `resultats/` gardent tout, en français.
- Réponses : `201` enregistré (ou déjà reçu) ; `400` corps invalide, champ en plus, dates incohérentes (ne pas renvoyer) ; `401` jeton (refaire un login) ; `404` session inconnue ; `409` session pas encore lancée ou appareil absent de la session (ne pas renvoyer) ; `5xx` ou réseau : renvoyer plus tard.

## 5. Limites connues

- **Jeton vérifié à l'ouverture de la WebSocket** : une révocation de la clé coupe le Pi tout de suite ; mais une session de connexion qui expire (60 min sans requête) ou fermée depuis la liste des sessions laisse la WebSocket ouverte jusqu'à la prochaine reconnexion.
- **Aucune limite de tentatives** sur les routes de login (mot de passe comme clé). Sans conséquence pour la clé (256 bits), à ajouter pour le mot de passe (tout le projet).
- **Une seule instance du serveur** : la liste des Pi connectés est gardée en mémoire (`DeviceConnections`). Avec plusieurs instances, il faudrait la partager (Redis…).
- **Seuils** : `session:start` ne les envoie pas encore (pas stockés côté serveur) ; le Pi garde ses seuils fixes (`SEUILS`).
- **Prod** : `client/nginx.conf` ne relaie pas encore les WebSockets (en-têtes `Upgrade` et `Connection` à ajouter sur `/api/devices/ws`).

## 6. Côté Pi : configuration

Variables d'environnement, dans `edge/.env` (ignoré par Git ; modèle commenté : [`edge/.env.example`](../.env.example)) :

| Variable | Exemple |
|---|---|
| `DOSDANE_SERVEUR` | `http://localhost:3000` en dev, `https://…` en prod (WebSocket en `ws://` ou `wss://` d'après lui) |
| `DOSDANE_APPAREIL`, `DOSDANE_CLE` | `deviceId` et `key` donnés par `POST /api/devices` (ou `/devices/:id/key`) ; la clé n'est jamais affichée par le Pi |

```bash
cd edge
cp .env.example .env && chmod 600 .env    # puis le remplir
set -a; source .env; set +a               # charge les variables dans le terminal
python -m outils.connexion                # login, connexion, ping
python -m outils.connexion --rester       # garde la liaison, la rouvre si elle tombe (Ctrl+C)
python poc.py --service                   # la vraie session, lancée et arrêtée par le serveur
```

`poc.py --service` n'ouvre la webcam que pendant une session : sur `session:start`, une analyse commence (fichiers de `resultats/` au nom de la session du serveur) ; sur `session:stop`, elle se termine comme un Ctrl+C (alertes fermées, dernier résumé, bilan) et le Pi attend la suivante. Ctrl+C ou SIGTERM (systemd) arrêtent le service proprement.

## 7. Tester à la main

```bash
# refusé (4401)
npx wscat -c ws://localhost:3000/api/devices/ws
# accepté avec le jeton d'un Pi (Swagger : POST /api/devices, puis POST /api/auth/device-login)
npx wscat -c ws://localhost:3000/api/devices/ws -H "Authorization: Bearer <accessToken>"
< {"event":"ready","data":{"deviceId":"…","sessionId":null}}
> {"event":"ping","data":"bonjour"}
< {"event":"pong","data":"bonjour"}
```

Code : côté Pi [`edge/posture/serveur.py`](../posture/serveur.py) ; côté serveur, passerelle [`server/src/analysis/devices.gateway.ts`](../../server/src/analysis/devices.gateway.ts), Pi connectés [`device-connections.ts`](../../server/src/analysis/device-connections.ts), envoi des commandes dans [`analysis.service.ts`](../../server/src/analysis/analysis.service.ts), état en direct [`dto/device-messages.dto.ts`](../../server/src/analysis/dto/device-messages.dto.ts) et [`live-states.ts`](../../server/src/analysis/live-states.ts), refus des messages non authentifiés dans [`server/src/auth/auth.guard.ts`](../../server/src/auth/auth.guard.ts).

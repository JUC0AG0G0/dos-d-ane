# Liaison Pi ↔ serveur : le contrat

Ce que le Raspberry Pi et le serveur doivent respecter pour se parler. **Pourquoi** ces choix (WebSocket ouverte par le Pi, POST pour ce qui est stocké, rien d'identifiant ne sort du Pi) : [audit §7.2](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md#72-ce-qui-sort-du-pi--messages-et-transport). Ici, seulement le **comment**.

Légende : ✅ en place · 🔜 prévu (étape de la branche `feat/envoi-serveur`).

## 1. Qui passe par où

| Quoi | Sens | Transport | Stocké ? |
|---|---|---|---|
| Commandes `session:start` / `session:stop` ✅ | serveur → Pi | WebSocket | non |
| État en direct `state` 🔜 A6 | Pi → serveur | WebSocket | non, relayé à l'app (SSE) |
| `heartbeat` 🔜 | Pi → serveur | WebSocket | non |
| Événements, résumés 🔜 B1 | Pi → serveur | HTTPS POST | oui |

**Ne sort jamais du Pi** : image, pixels, vidéo, **points du corps (keypoints)**, nom ou email de la personne.

## 2. Connexion WebSocket ✅

C'est **le Pi** qui ouvre la connexion, et il la rouvre si elle tombe.

| | |
|---|---|
| Adresse | `ws://<serveur>:3000/api/devices/ws` en dev ; `wss://<domaine>/api/devices/ws` en prod (chiffré) |
| Authentification | header `Authorization: Bearer <accessToken>` |
| Jeton | `accessToken` de `POST /api/auth/login` avec `"device": { "type": "raspberry" }` |
| Taille max d'un message | 16 Ko (au-delà, le serveur coupe la connexion) |

Le jeton passe **toujours dans le header, jamais dans l'URL** (`?token=…`) : les URL sont écrites dans les journaux (nginx, proxys).

Le serveur vérifie le jeton **une fois, à l'ouverture**, puis envoie `ready`. **Le Pi attend `ready` avant d'envoyer quoi que ce soit** : avant, ses messages seraient refusés (`Connexion requise`).

Le login renvoie un `deviceId` : le Pi le garde (`~/.local/state/dos-dane/appareil`) et le renvoie aux logins suivants (`"device": { "id": …, "type": "raspberry" }`), sinon le serveur crée un nouvel appareil à chaque fois.

### Codes de fermeture

| Code | Raison envoyée | Cause | Ce que fait le Pi |
|---|---|---|---|
| `4401` | Connexion requise | jeton absent, invalide, expiré ou session révoquée | refaire un login, puis se reconnecter |
| `4403` | Réservé aux Raspberry Pi | la session a été ouverte depuis un autre type d'appareil | ne pas réessayer : erreur de configuration |
| `4409` | Remplacée par une autre connexion | le même appareil (même `deviceId`) s'est connecté ailleurs | réessayer plus tard ; si ça se répète, deux Pi partagent le même fichier `appareil` |
| `1011` | Erreur du serveur | base injoignable… | réessayer plus tard (attente croissante) |
| autre (`1006`…) | — | réseau coupé, serveur redémarré | réessayer plus tard (attente croissante) |

Attente croissante ✅ : 1 s, doublée à chaque échec jusqu'à 60 s (± 20 % pour que plusieurs Pi ne reviennent pas tous ensemble), remise à 1 s après une connexion réussie. Login refusé (mauvais mot de passe) ou `4403` : le Pi s'arrête et dit pourquoi, réessayer ne servirait à rien. Pendant une coupure, l'état en direct est perdu (le suivant le remplace) ; l'analyse, elle, continue.

## 3. Format des messages WebSocket

Toujours du JSON : `{ "event": "<nom>", "data": <contenu> }`. Un message qui n'est pas du JSON valide, ou dont l'`event` est inconnu, est ignoré.

Erreur renvoyée par le serveur : `{ "event": "exception", "data": { "status": "error", "message": "…" } }`.

| `event` | Sens | `data` | État |
|---|---|---|---|
| `ready` | serveur → Pi | `{ "deviceId": "<uuid>", "sessionId": "<uuid>" \| null }` | ✅ connexion acceptée ; toujours le premier message |
| `ping` → `pong` | Pi → serveur → Pi | n'importe quoi, renvoyé tel quel | ✅ test de la liaison |
| `session:start` | serveur → Pi | `{ "sessionId": "<uuid>" }` (seuils plus tard) | ✅ |
| `session:stop` | serveur → Pi | `{ "sessionId": "<uuid>" }` | ✅ |
| `state` | Pi → serveur | voir ci-dessous | 🔜 A6 |
| `heartbeat` | Pi → serveur | température, version, état de la caméra | 🔜 |

### Sessions : la base fait foi

`sessionId` de `ready` = la session d'analyse **en cours** à laquelle l'appareil participe (`null` sinon). Le Pi s'y aligne à chaque connexion : un Pi éteint ou déconnecté pendant un start ou un stop se remet à jour tout seul, sans file d'attente côté serveur. Ensuite, le serveur envoie :

| Action (REST, app ou site) | Message aux Pi de la session |
|---|---|
| `POST /analysis-sessions/:id/start` | `session:start` |
| `POST /analysis-sessions/:id/stop` | `session:stop` |
| `POST /analysis-sessions/:id/devices` sur une session en cours | `session:start` au Pi ajouté |
| `DELETE /analysis-sessions/:id/devices/:deviceId` sur une session en cours | `session:stop` au Pi retiré |
| `DELETE /analysis-sessions/:id` sur une session en cours | `session:stop` |

Le Pi compare toujours avec ce qu'il fait déjà (`commande()` dans `posture/serveur.py`) : un message répété ne change rien, un `session:stop` d'une autre session est ignoré. **Une coupure de la liaison n'arrête pas la session** : le Pi continue d'analyser, et `ready` lui dit à la reconnexion si elle a été arrêtée entre-temps.

`state` (champs à confirmer en A6, d'après l'audit §7.2) : id de la session, heure, posture (`FORWARD_HEAD`, `NECK_FLEXION`, `TRUNK_FORWARD`, `TRUNK_BACKWARD`, `IMMOBILE` ou bonne posture), couleur, angle tête, angle tronc, score de la période. Deux angles seulement : **aucun point du corps**.

## 4. Limites connues

- **Le jeton n'est vérifié qu'à l'ouverture** : si la session de connexion est révoquée ou expire (`SESSION_TTL_MINUTES`, 60 min sans requête), le socket déjà ouvert reste ouvert. Corrigé par la **clé d'appareil** (B2 : `Authorization: Device <clé>`, sans mot de passe sur le Pi, révocable) et une vérification régulière.
- **Le login demande l'email et le mot de passe d'une personne** sur le Pi : provisoire, jusqu'à la clé d'appareil (B2).
- **Une seule instance du serveur** : la liste des Pi connectés est gardée en mémoire (`DeviceConnections`). Avec plusieurs instances, il faudrait la partager (Redis…).
- **Seuils** : `session:start` ne les envoie pas encore (pas stockés côté serveur) ; le Pi garde ses seuils fixes (`SEUILS`).
- **Prod** : `client/nginx.conf` ne relaie pas encore les WebSockets (en-têtes `Upgrade` et `Connection` à ajouter sur `/api/devices/ws`).

## 5. Côté Pi : configuration

Variables d'environnement, dans `edge/.env` (ignoré par Git ; modèle commenté : [`edge/.env.example`](../.env.example)) :

| Variable | Exemple |
|---|---|
| `DOSDANE_SERVEUR` | `http://localhost:3000` en dev, `https://…` en prod (WebSocket en `ws://` ou `wss://` d'après lui) |
| `DOSDANE_EMAIL`, `DOSDANE_MOT_DE_PASSE` | compte de test du Pi (provisoire, voir §4) |

```bash
cd edge
cp .env.example .env && chmod 600 .env    # puis le remplir
set -a; source .env; set +a               # charge les variables dans le terminal
python -m outils.connexion                # login, connexion, ping
python -m outils.connexion --rester       # garde la liaison, la rouvre si elle tombe (Ctrl+C)
```

## 6. Tester à la main

```bash
# refusé (4401)
npx wscat -c ws://localhost:3000/api/devices/ws
# accepté avec un jeton de login raspberry (Swagger : POST /api/auth/login)
npx wscat -c ws://localhost:3000/api/devices/ws -H "Authorization: Bearer <accessToken>"
< {"event":"ready","data":{"deviceId":"…","sessionId":null}}
> {"event":"ping","data":"bonjour"}
< {"event":"pong","data":"bonjour"}
```

Code : côté Pi [`edge/posture/serveur.py`](../posture/serveur.py) ; côté serveur, passerelle [`server/src/analysis/devices.gateway.ts`](../../server/src/analysis/devices.gateway.ts), Pi connectés [`device-connections.ts`](../../server/src/analysis/device-connections.ts), envoi des commandes dans [`analysis.service.ts`](../../server/src/analysis/analysis.service.ts), refus des messages non authentifiés dans [`server/src/auth/auth.guard.ts`](../../server/src/auth/auth.guard.ts).

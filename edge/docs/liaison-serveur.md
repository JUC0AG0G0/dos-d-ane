# Liaison Pi ↔ serveur : le contrat

Ce que le Raspberry Pi et le serveur doivent respecter pour se parler. **Pourquoi** ces choix (WebSocket ouverte par le Pi, POST pour ce qui est stocké, rien d'identifiant ne sort du Pi) : [audit §7.2](Audit_technique_final_Fil_Rouge_Master_UHA_4_0_v3.md#72-ce-qui-sort-du-pi--messages-et-transport). Ici, seulement le **comment**.

Légende : ✅ en place · 🔜 prévu (étape de la branche `feat/envoi-serveur`).

## 1. Qui passe par où

| Quoi | Sens | Transport | Stocké ? |
|---|---|---|---|
| Commandes `session:start` / `session:stop` 🔜 A5 | serveur → Pi | WebSocket | non |
| État en direct `state` 🔜 A4 | Pi → serveur | WebSocket | non, relayé à l'app (SSE) |
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

Le serveur vérifie le jeton **une fois, à l'ouverture**. Tant que ce n'est pas fini, les messages reçus sont refusés.

### Codes de fermeture

| Code | Raison envoyée | Cause | Ce que fait le Pi |
|---|---|---|---|
| `4401` | Connexion requise | jeton absent, invalide, expiré ou session révoquée | refaire un login, puis se reconnecter |
| `4403` | Réservé aux Raspberry Pi | la session a été ouverte depuis un autre type d'appareil | ne pas réessayer : erreur de configuration |
| `1011` | Erreur du serveur | base injoignable… | réessayer plus tard (attente croissante) |
| autre (`1006`…) | — | réseau coupé, serveur redémarré | réessayer plus tard (attente croissante) |

## 3. Format des messages WebSocket

Toujours du JSON : `{ "event": "<nom>", "data": <contenu> }`. Un message qui n'est pas du JSON valide, ou dont l'`event` est inconnu, est ignoré.

Erreur renvoyée par le serveur : `{ "event": "exception", "data": { "status": "error", "message": "…" } }`.

| `event` | Sens | `data` | État |
|---|---|---|---|
| `ping` → `pong` | Pi → serveur → Pi | n'importe quoi, renvoyé tel quel | ✅ test de la liaison |
| `state` | Pi → serveur | voir ci-dessous | 🔜 A4 |
| `session:start` | serveur → Pi | id de la session d'analyse (UUID) et seuils | 🔜 A5 |
| `session:stop` | serveur → Pi | id de la session d'analyse | 🔜 A5 |
| `heartbeat` | Pi → serveur | température, version, état de la caméra | 🔜 |

`state` (champs à confirmer en A4, d'après l'audit §7.2) : id de la session, heure, posture (`FORWARD_HEAD`, `NECK_FLEXION`, `TRUNK_FORWARD`, `TRUNK_BACKWARD`, `IMMOBILE` ou bonne posture), couleur, angle tête, angle tronc, score de la période. Deux angles seulement : **aucun point du corps**.

## 4. Limites connues

- **Le jeton n'est vérifié qu'à l'ouverture** : si la session de connexion est révoquée ou expire (`SESSION_TTL_MINUTES`, 60 min sans requête), le socket déjà ouvert reste ouvert. Corrigé par la **clé d'appareil** (B2 : `Authorization: Device <clé>`, sans mot de passe sur le Pi, révocable) et une vérification régulière.
- **Le login demande l'email et le mot de passe d'une personne** sur le Pi : provisoire, jusqu'à la clé d'appareil (B2).
- **Prod** : `client/nginx.conf` ne relaie pas encore les WebSockets (en-têtes `Upgrade` et `Connection` à ajouter sur `/api/devices/ws`).

## 5. Tester à la main

```bash
# refusé (4401)
npx wscat -c ws://localhost:3000/api/devices/ws
# accepté avec un jeton de login raspberry (Swagger : POST /api/auth/login)
npx wscat -c ws://localhost:3000/api/devices/ws -H "Authorization: Bearer <accessToken>"
> {"event":"ping","data":"bonjour"}
< {"event":"pong","data":"bonjour"}
```

Code : passerelle [`server/src/analysis/devices.gateway.ts`](../../server/src/analysis/devices.gateway.ts), refus des messages non authentifiés dans [`server/src/auth/auth.guard.ts`](../../server/src/auth/auth.guard.ts).

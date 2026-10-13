# Routes de l’API

<!-- Fichier généré par `task api:docs` depuis les contrôleurs : ne pas modifier à la main. -->

Accès : `public` sans connexion, `connecté` avec un token (`Authorization: Bearer …`), sinon le rôle requis.
Détail des corps et des réponses : `openapi.json` (importable dans Postman, Bruno ou Swagger Editor) ou `/api/docs` en dev.

## auth

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Crée un compte (rôle user) |
| POST | `/api/auth/login` | public | Connexion par email et mot de passe |
| GET | `/api/auth/me` | connecté | Utilisateur connecté |
| POST | `/api/auth/logout` | connecté | Déconnecte la session en cours |
| GET | `/api/auth/sessions` | connecté | Sessions de l’utilisateur, actives et passées |
| DELETE | `/api/auth/sessions` | connecté | Déconnecte tous les autres appareils |
| DELETE | `/api/auth/sessions/{id}` | connecté | Déconnecte une session (cet appareil ou un autre) |

## devices

| Méthode | Route | Accès | Description |
|---|---|---|---|
| PATCH | `/api/devices/{id}` | connecté | Renomme un de ses appareils |

## health

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/health` | public | État de l'API et de la base, version déployée |

## users

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/users` | admin | Liste tous les utilisateurs (emails masqués) |
| GET | `/api/users/{id}/email` | admin | Affiche l'email d'un utilisateur |
| PATCH | `/api/users/role` | admin | Change le rôle d'un ou plusieurs utilisateurs |

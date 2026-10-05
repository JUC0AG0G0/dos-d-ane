# Backend (NestJS)

API REST de Dos d'âne : reçoit les mesures des capteurs et les expose au web, au mobile et à la vue administrateur.

## Démarrer en local (sans Docker)

```bash
cp .env.example .env      # puis adapter les valeurs
npm install
npm run start:dev         # http://localhost:3000/api/health
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run start:dev` | serveur avec rechargement automatique |
| `npm test` | tests unitaires (Vitest) |
| `npm run test:e2e` | tests de bout en bout de l'API (Supertest) |
| `npm run lint` | lint (oxlint) |
| `npm run format:check` | vérification du formatage (Prettier) |
| `npm run build` | compilation dans `dist/` |

## Endpoints

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | état de l'API, environnement et version |
| POST | `/api/measurements` | envoi d'une mesure par un capteur (en-tête `X-Sensor-Key`) |
| GET | `/api/measurements?limit=&sensorType=` | dernières mesures (à protéger par une authentification admin) |

Le format d'une mesure est décrit dans `src/measurements/measurement.dto.ts` et dans `docs/architecture.md`.

## Configuration

Toutes les variables sont validées au démarrage (`src/config/env.validation.ts`) : l'API refuse de démarrer si l'une d'elles manque ou est invalide.

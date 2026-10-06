# Server (NestJS)

API REST de Dos d'âne. Pour l'instant : une route `GET /api/health` et la documentation Swagger.

## Démarrer en local (sans Docker)

```bash
cp .env.example .env      # puis adapter les valeurs
npm install
npm run start:dev         # http://localhost:3000/api/docs
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run start:dev` | serveur avec rechargement automatique |
| `npm run lint` | lint (oxlint) |
| `npm run format` / `format:check` | formatage (Prettier) |
| `npm run build` | compilation dans `dist/` |

## Swagger

- Interface : http://localhost:3000/api/docs
- Schéma OpenAPI : http://localhost:3000/api/docs-json

Actif hors production ; en production, seulement si `SWAGGER_ENABLED=true`.

## Configuration

Les variables sont vérifiées au démarrage (`src/config/env.validation.ts`) : l'API refuse de démarrer si l'une d'elles est invalide.

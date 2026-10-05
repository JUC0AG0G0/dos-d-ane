# Web (React + Vite)

Site utilisateur de Dos d'âne (et, plus tard, vue administrateur).

## Démarrer en local

```bash
npm install
npm run dev        # http://localhost:5173, /api est redirigé vers http://localhost:3000
```

Pour viser un autre backend en dev, copier `.env.example` en `.env` et changer `API_PROXY_TARGET`.

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm test` | tests (Vitest + Testing Library) |
| `npm run lint` | lint (oxlint) |
| `npm run build` | vérification TypeScript et build dans `dist/` |

## Pourquoi `/api` en relatif ?

Le front n'embarque aucune URL de backend. En dev, Vite fait le proxy ; en Docker, nginx (`nginx/default.conf.template`) redirige `/api/` vers `API_UPSTREAM`. La même image sert donc en dev, staging et production, seul l'environnement du conteneur change.

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
| `npm run lint` | lint (oxlint) |
| `npm run build` | vérification TypeScript et build dans `dist/` |

## Appeler l'API

Utiliser des URL relatives `/api/...`. En dev, Vite fait le proxy ; en Docker, nginx (`nginx/default.conf.template`) redirige `/api/` vers le backend. La même image sert donc dans tous les environnements.

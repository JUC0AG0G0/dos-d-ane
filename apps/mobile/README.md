# Mobile (React Native + Expo)

Application mobile de Dos d'âne.

## Démarrer en local

```bash
cp .env.example .env   # adapter EXPO_PUBLIC_API_URL (IP du PC si téléphone physique)
npm install
npm start              # puis scanner le QR code avec Expo Go
```

Pour ajouter une dépendance native, utiliser `npx expo install <paquet>` afin d'obtenir une version compatible avec le SDK Expo.

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm start` | serveur Metro / Expo |
| `npm test` | tests (Jest + jest-expo + Testing Library) |
| `npm run lint` | lint (oxlint) |
| `npm run typecheck` | vérification TypeScript |

## Environnements

`EXPO_PUBLIC_APP_ENV` et `EXPO_PUBLIC_API_URL` sont lues au build :

- en local, dans `.env` ;
- pour les builds EAS, dans les profils `development`, `staging` et `production` de `eas.json` (`eas build --profile staging`).

`app.config.ts` ajoute un suffixe au nom et à l'identifiant de l'application hors production, pour installer plusieurs variantes sur le même téléphone. Ces variables sont visibles dans l'application : n'y mettez jamais de secret.

L'application mobile n'est pas conteneurisée : elle est distribuée par Expo Go (développement) ou par un build EAS (APK/IPA).

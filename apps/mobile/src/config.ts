/**
 * Configuration lue au build : Expo remplace les variables EXPO_PUBLIC_*
 * par leur valeur (fichier .env en local, profils de eas.json pour les builds).
 * Ne jamais y mettre de secret : elles sont lisibles dans l'application.
 */
export const config = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api',
};

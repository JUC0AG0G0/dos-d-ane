// Seul fichier qui lit import.meta.env : le reste de l'app importe `env`.
// Valeurs dans .env.dev (racine du dépôt), passées par docker compose.
export const env = {
  /** Adresse de l'API. `/api` passe par le relais Vite ou nginx (sans CORS). */
  apiUrl: (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, ''),
};

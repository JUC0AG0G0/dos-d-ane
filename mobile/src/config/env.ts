/**
 * Adresses du serveur. Par défaut, le serveur de l'équipe (réseau de l'école,
 * en http : joignable seulement depuis le Wi-Fi de l'école). Pour un autre
 * serveur, par exemple celui lancé sur son PC avec `task dev` :
 *   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api npx expo start
 */
const SITE_PAR_DEFAUT = 'http://dos-dane.julescorneille.fr';

const sansSlashFinal = (url: string) => url.replace(/\/$/, '');

export const env = {
  /** Racine de l'API NestJS (routes /auth/login, /auth/me…). */
  apiUrl: sansSlashFinal(process.env.EXPO_PUBLIC_API_URL || `${SITE_PAR_DEFAUT}/api`),
  /** Site web, pour les pages légales (conditions, confidentialité). */
  siteUrl: sansSlashFinal(process.env.EXPO_PUBLIC_SITE_URL || SITE_PAR_DEFAUT),
};

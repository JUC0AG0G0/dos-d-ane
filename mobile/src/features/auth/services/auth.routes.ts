/** Routes d'authentification de l'API (mêmes que le site web). */
export const AUTH_ROUTES = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  me: '/auth/me',
} as const;

// Toutes les routes de l'API appelées par le client, relatives à env.apiUrl.
// Une route ajoutée côté serveur s'ajoute ici, puis dans le service du domaine.
export const API_ROUTES = {
  health: '/health',
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    sessions: '/auth/sessions',
    session: (id: string) => `/auth/sessions/${encodeURIComponent(id)}`,
  },
  devices: {
    device: (id: string) => `/devices/${encodeURIComponent(id)}`,
  },
} as const;

export const SETTINGS_ROUTES = {
  sessions: '/auth/sessions',
  session: (id: string) => `/auth/sessions/${encodeURIComponent(id)}`,
  device: (id: string) => `/devices/${encodeURIComponent(id)}`,
} as const;

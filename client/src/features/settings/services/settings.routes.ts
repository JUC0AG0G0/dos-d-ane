export const SETTINGS_ROUTES = {
  sessions: '/auth/sessions',
  session: (id: string) => `/auth/sessions/${encodeURIComponent(id)}`,
  device: (id: string) => `/devices/${encodeURIComponent(id)}`,
  devices: '/devices',
  deviceKey: (id: string) => `/devices/${encodeURIComponent(id)}/key`,
  pairingClaim: '/devices/pairing/claim',
} as const;

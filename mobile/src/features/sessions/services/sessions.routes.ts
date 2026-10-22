const session = (id: string) => `/analysis-sessions/${encodeURIComponent(id)}`;

/** Routes des sessions d'analyse et des appareils (mêmes que le site web). */
export const SESSIONS_ROUTES = {
  sessions: '/analysis-sessions',
  session,
  start: (id: string) => `${session(id)}/start`,
  pause: (id: string) => `${session(id)}/pause`,
  resume: (id: string) => `${session(id)}/resume`,
  stop: (id: string) => `${session(id)}/stop`,
  captures: (id: string, curseur?: string) =>
    `${session(id)}/captures${curseur ? `?cursor=${encodeURIComponent(curseur)}` : ''}`,
  capture: (id: string) => `/captures/${encodeURIComponent(id)}`,
  devices: '/devices',
} as const;

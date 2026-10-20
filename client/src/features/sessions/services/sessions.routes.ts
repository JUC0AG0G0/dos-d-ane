const query = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
};

const session = (id: string) => `/analysis-sessions/${encodeURIComponent(id)}`;

export const SESSIONS_ROUTES = {
  sessions: (status?: string, limit?: number) =>
    `/analysis-sessions${query({ status, limit })}`,
  stats: '/analysis-sessions/stats',
  session,
  start: (id: string) => `${session(id)}/start`,
  pause: (id: string) => `${session(id)}/pause`,
  resume: (id: string) => `${session(id)}/resume`,
  stop: (id: string) => `${session(id)}/stop`,
  live: (id: string) => `${session(id)}/live`,
  devices: (id: string) => `${session(id)}/devices`,
  device: (id: string, deviceId: string) =>
    `${session(id)}/devices/${encodeURIComponent(deviceId)}`,
  captures: (id: string, cursor?: string, limit?: number) =>
    `${session(id)}/captures${query({ cursor, limit })}`,
  timeline: (id: string, bucketMinutes: number) =>
    `${session(id)}/timeline${query({ bucketMinutes })}`,
  capture: (id: string) => `/captures/${encodeURIComponent(id)}`,
  userDevices: '/devices',
} as const;

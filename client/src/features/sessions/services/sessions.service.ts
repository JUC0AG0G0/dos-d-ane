import { http } from '@/services';
import type {
  Capture,
  CapturePage,
  Device,
  SessionDetail,
  SessionStats,
  SessionSummary,
  SessionTimeline,
} from '../types/sessions.types';
import { SESSIONS_ROUTES as R } from './sessions.routes';

/** Filtre de la liste : un état, ou open (préparation, en cours, en pause). */
export type SessionFilter = 'setup' | 'running' | 'paused' | 'ended' | 'open';

export const sessionsService = {
  list: (status?: SessionFilter, limit?: number) =>
    http.get<SessionSummary[]>(R.sessions(status, limit)),
  stats: () => http.get<SessionStats>(R.stats),
  get: (id: string) => http.get<SessionDetail>(R.session(id)),
  /** Nouvelle session en préparation, sans appareil. */
  create: () =>
    http.post<SessionDetail>(R.sessions(), { deviceIds: [] as string[] }),
  start: (id: string) => http.post<SessionDetail>(R.start(id)),
  pause: (id: string) => http.post<SessionDetail>(R.pause(id)),
  resume: (id: string) => http.post<SessionDetail>(R.resume(id)),
  stop: (id: string) => http.post<SessionDetail>(R.stop(id)),
  remove: (id: string) => http.delete<void>(R.session(id)),
  addDevice: (id: string, deviceId: string) =>
    http.post<SessionDetail>(R.devices(id), { deviceId }),
  removeDevice: (id: string, deviceId: string) =>
    http.delete<SessionDetail>(R.device(id, deviceId)),
  captures: (id: string, cursor?: string, limit = 50) =>
    http.get<CapturePage>(R.captures(id, cursor, limit)),
  timeline: (id: string, bucketMinutes = 10) =>
    http.get<SessionTimeline>(R.timeline(id, bucketMinutes)),
  capture: (id: string) => http.get<Capture>(R.capture(id)),
  devices: () => http.get<Device[]>(R.userDevices),
};

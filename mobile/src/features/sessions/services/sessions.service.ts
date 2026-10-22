import { http } from '@/services/http';

import type {
  AnalysisSession,
  Capture,
  CaptureInput,
  CapturePage,
  Device,
} from '../types/sessions.types';
import { SESSIONS_ROUTES as R } from './sessions.routes';

export const sessionsService = {
  /** Session en préparation ; sans corps, le serveur y met l'appareil qui fait la requête. */
  create: () => http.post<AnalysisSession>(R.sessions, {}),
  get: (id: string) => http.get<AnalysisSession>(R.session(id)),
  start: (id: string) => http.post<AnalysisSession>(R.start(id)),
  pause: (id: string) => http.post<AnalysisSession>(R.pause(id)),
  resume: (id: string) => http.post<AnalysisSession>(R.resume(id)),
  stop: (id: string) => http.post<AnalysisSession>(R.stop(id)),
  remove: (id: string) => http.delete<void>(R.session(id)),
  addCapture: (id: string, capture: CaptureInput) => http.post<unknown>(R.captures(id), capture),
  /** Captures de la session, de la plus ancienne à la plus récente, par pages de 50. */
  captures: (id: string, curseur?: string) => http.get<CapturePage>(R.captures(id, curseur)),
  capture: (id: string) => http.get<Capture>(R.capture(id)),
  devices: () => http.get<Device[]>(R.devices),
};

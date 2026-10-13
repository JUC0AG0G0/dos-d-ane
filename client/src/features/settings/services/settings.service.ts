import { http } from '@/services';
import type { Session, SessionDevice } from '../types/settings.types';
import { SETTINGS_ROUTES } from './settings.routes';

export const settingsService = {
  sessions: () => http.get<Session[]>(SETTINGS_ROUTES.sessions),
  revokeSession: (id: string) => http.delete<void>(SETTINGS_ROUTES.session(id)),
  revokeOtherSessions: () =>
    http.delete<{ revoked: number }>(SETTINGS_ROUTES.sessions),
  renameDevice: (id: string, name: string) =>
    http.patch<SessionDevice>(SETTINGS_ROUTES.device(id), { name }),
};

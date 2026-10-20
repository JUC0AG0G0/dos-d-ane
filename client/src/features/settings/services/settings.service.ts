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
  /** Appareils du compte (les Raspberry Pi, même jamais connectés). */
  devices: () => http.get<SessionDevice[]>(SETTINGS_ROUTES.devices),
  /** Ajoute le Raspberry Pi dont on a tapé le code d'étiquette ; il relève sa clé tout seul. */
  claimRaspberry: (code: string, name: string) =>
    http.post<SessionDevice>(SETTINGS_ROUTES.pairingClaim, { code, name }),
  /** Le Pi est coupé tout de suite et attend d'être ajouté de nouveau avec son code. */
  revokeDeviceKey: (id: string) =>
    http.delete<void>(SETTINGS_ROUTES.deviceKey(id)),
};

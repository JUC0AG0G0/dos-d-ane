import type { KeyStatus } from '@/utils/raspberry';

export interface SessionDevice {
  id: string;
  name: string;
  type: string;
  model: string | null;
}

/** Appareil du compte (GET /devices). */
export interface UserDevice extends SessionDevice {
  /**
   * Clé d'un Raspberry Pi : active ; pending, ajouté mais clé pas encore
   * relevée ; revoked, révoquée (le Pi attend d'être ajouté de nouveau).
   */
  keyStatus: KeyStatus;
  /** Raspberry Pi connecté au serveur ; null pour un autre appareil. */
  online: boolean | null;
}

export interface Session {
  id: string;
  device: SessionDevice;
  active: boolean;
  current: boolean;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  ipAddress: string | null;
  revokedAt: string | null;
}

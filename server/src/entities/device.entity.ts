import type { Device as DeviceRow } from '../generated/prisma/client.js';
import { TimestampedEntity } from './base/base.entity.js';

/** Types d'appareils connus. D'autres capteurs pourront s'ajouter. */
export const DeviceType = {
  Web: 'web',
  Mobile: 'mobile',
  Desktop: 'desktop',
  Raspberry: 'raspberry',
  Camera: 'camera',
} as const;

/** Appareil lié à un compte. Un navigateur n'est jamais éligible à la capture. */
export class Device extends TimestampedEntity implements DeviceRow {
  userId: string;
  name: string;
  type: string;
  model: string | null;
  captureEligible: boolean;
  /** Empreinte SHA-256 de la clé d'un Raspberry Pi (jamais à renvoyer au client). */
  keyHash: string | null;
  keyCreatedAt: Date | null;
}

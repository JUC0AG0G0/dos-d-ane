import type { Device as DeviceRow } from '../generated/prisma/client.js';
import { TimestampedEntity } from './base/base.entity.js';

/** Types d'appareils connus. D'autres capteurs pourront s'ajouter. */
export const DeviceType = {
  Web: 'web',
  Mobile: 'mobile',
  Camera: 'camera',
} as const;

/** État d'un appareil éligible à la capture. */
export const CaptureStatus = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

/**
 * Appareil lié à un compte. Un navigateur n'est jamais éligible à la capture ;
 * captureStatus n'a de valeur que pour un appareil éligible.
 */
export class Device extends TimestampedEntity implements DeviceRow {
  userId: string;
  name: string;
  type: string;
  model: string | null;
  captureEligible: boolean;
  captureStatus: string | null;
}

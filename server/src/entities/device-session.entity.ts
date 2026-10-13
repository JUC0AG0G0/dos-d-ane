import type { DeviceSession as DeviceSessionRow } from '../generated/prisma/client.js';
import { CreatedEntity } from './base/base.entity.js';

/** Participation d'un appareil éligible à une session d'analyse. */
export class DeviceSession extends CreatedEntity implements DeviceSessionRow {
  analysisSessionId: string;
  deviceId: string;
  startedAt: Date;
  endedAt: Date | null;
}

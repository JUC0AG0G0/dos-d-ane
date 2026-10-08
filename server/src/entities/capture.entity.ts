import type { Capture as CaptureRow } from '../generated/prisma/client.js';
import { CreatedEntity } from './base/base.entity.js';

/** Prise de vue d'un appareil. L'image n'est pas stockée, seulement sa taille en pixels. */
export class Capture extends CreatedEntity implements CaptureRow {
  deviceSessionId: string;
  capturedAt: Date;
  imageWidth: number;
  imageHeight: number;
}

import type { Keypoint as KeypointRow } from '../generated/prisma/client.js';
import { CreatedEntity } from './base/base.entity.js';

/** Point d'une articulation sur une capture, en pixels (origine en haut à gauche). */
export class Keypoint extends CreatedEntity implements KeypointRow {
  captureId: string;
  bodyPartId: string;
  x: number;
  y: number;
  confidence: number | null;
}

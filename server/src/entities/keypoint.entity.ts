import type {
  BodyPart,
  Keypoint as KeypointRow,
} from '../generated/prisma/client.js';
import { CreatedEntity } from './base/base.entity.js';

/** Point d'une articulation sur une capture, en pixels (origine en haut à gauche). */
export class Keypoint extends CreatedEntity implements KeypointRow {
  captureId: string;
  bodyPart: BodyPart;
  x: number;
  y: number;
  confidence: number | null;
}

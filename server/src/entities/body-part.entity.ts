import type { BodyPart as BodyPartRow } from '../generated/prisma/client.js';
import { BaseEntity } from './base/base.entity.js';

/** Articulation ou partie du corps : head, left_shoulder, right_hip... */
export class BodyPart extends BaseEntity implements BodyPartRow {
  code: string;
  label: string;
}

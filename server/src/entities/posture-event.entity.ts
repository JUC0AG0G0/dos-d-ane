import type {
  Prisma,
  PostureEvent as PostureEventRow,
} from '../generated/prisma/client.js';
import { TimestampedEntity } from './base/base.entity.js';

/** Types d'alerte envoyés par le Pi (même liste que le CHECK de la migration). */
export const PostureEventType = {
  ForwardHead: 'FORWARD_HEAD',
  TrunkForward: 'TRUNK_FORWARD',
  TrunkBackward: 'TRUNK_BACKWARD',
  Immobile: 'IMMOBILE',
} as const;
export type PostureEventType =
  (typeof PostureEventType)[keyof typeof PostureEventType];

/** Alerte de posture d'un Pi : créée à son début, complétée à sa fin. */
export class PostureEvent extends TimestampedEntity implements PostureEventRow {
  deviceSessionId: string;
  clientId: string;
  type: string;
  startedAt: Date;
  endedAt: Date | null;
  headAngleAvg: number | null;
  trunkAngleAvg: number | null;
  causes: Prisma.JsonValue | null;
}

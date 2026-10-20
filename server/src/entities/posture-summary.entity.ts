import type { PostureSummary as PostureSummaryRow } from '../generated/prisma/client.js';
import { CreatedEntity } from './base/base.entity.js';

/** Résumé d'une période (5 min) envoyé par un Pi : score et temps par couleur. */
export class PostureSummary extends CreatedEntity implements PostureSummaryRow {
  deviceSessionId: string;
  clientId: string;
  periodStart: Date;
  periodEnd: Date;
  score: number | null;
  secondsGreen: number;
  secondsOrange: number;
  secondsRed: number;
  secondsIgnored: number;
  secondsAbsent: number;
}

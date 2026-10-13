import type { AnalysisSession as AnalysisSessionRow } from '../generated/prisma/client.js';
import { TimestampedEntity } from './base/base.entity.js';

/** Session d'analyse générale d'un utilisateur, sur un ou plusieurs appareils. */
export class AnalysisSession
  extends TimestampedEntity
  implements AnalysisSessionRow
{
  userId: string;
  startedAt: Date;
  endedAt: Date | null;
}

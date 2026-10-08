import type { AuthSession as AuthSessionRow } from '../generated/prisma/client.js';
import { CreatedEntity } from './base/base.entity.js';

/** Connexion d'un utilisateur sur un appareil. Seul le hash du token est stocké. */
export class AuthSession extends CreatedEntity implements AuthSessionRow {
  userId: string;
  deviceId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date;
}

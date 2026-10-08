import { createHash, randomBytes } from 'node:crypto';

/** Durée de validité d'une session de connexion. */
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Token opaque envoyé au client (en-tête Authorization: Bearer). Seul son
 * SHA-256 est stocké : une fuite de la base ne permet pas de se connecter.
 * 32 octets aléatoires suffisent, un hachage lent est inutile ici.
 */
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

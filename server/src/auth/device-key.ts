import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Clé d'un Raspberry Pi : 256 bits aléatoires, échangés contre un JWT
 * (POST /auth/device-login) à la place d'un mot de passe. Seule l'empreinte
 * SHA-256 est gardée : la clé, très aléatoire, n'a pas besoin d'un hachage
 * lent comme un mot de passe choisi par une personne.
 */
export const newDeviceKey = () => `dk_${randomBytes(32).toString('base64url')}`;

export const hashDeviceKey = (key: string) =>
  createHash('sha256').update(key).digest('hex');

/** Compare en temps constant : le temps de réponse ne dit rien de la clé. */
export const sameKeyHash = (a: string, b: string) =>
  a.length === b.length &&
  timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));

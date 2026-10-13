import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/**
 * Hachage des mots de passe avec scrypt (inclus dans Node, sans dépendance).
 * Paramètres de l'OWASP Password Storage Cheat Sheet (N=2^15, r=8, p=3),
 * soit 32 Mio de mémoire par calcul. Ils sont stockés dans le hash pour
 * pouvoir les durcir plus tard sans casser les comptes existants.
 * Format : scrypt$N$r$p$sel$hash (base64).
 */
const PARAMS = { N: 2 ** 15, r: 8, p: 3 };
const KEY_LENGTH = 64;

function maxmem(N: number, r: number) {
  return 128 * N * r * 2;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const { N, r, p } = PARAMS;
  const hash = await scryptAsync(password, salt, KEY_LENGTH, {
    N,
    r,
    p,
    maxmem: maxmem(N, r),
  });
  return [
    'scrypt',
    N,
    r,
    p,
    salt.toString('base64'),
    hash.toString('base64'),
  ].join('$');
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [algo, n, r, p, salt, hash] = stored.split('$');
  if (algo !== 'scrypt' || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = await scryptAsync(
    password,
    Buffer.from(salt, 'base64'),
    expected.length,
    { N: Number(n), r: Number(r), p: Number(p), maxmem: maxmem(+n, +r) },
  );
  return timingSafeEqual(actual, expected);
}

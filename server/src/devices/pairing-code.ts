import { createHash } from 'node:crypto';

/**
 * Code imprimé sur l'étiquette d'un Raspberry Pi, créé par
 * edge/outils/preparer.py : 9 caractères Crockford base32 (~45 bits), sans
 * I, L, O ni U pour qu'on ne confonde pas 1/I/L et 0/O en le recopiant.
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const PAIRING_CODE_LENGTH = 9;

/** Secret de relève du Pi : `ps_` + 256 bits en base64url. */
export const PAIRING_SECRET_PATTERN = /^ps_[A-Za-z0-9_-]{43}$/;

/**
 * Code tel que tapé (casse, tirets, espaces) → forme canonique, ou null s'il
 * est invalide. Comme Crockford : O lu 0, I et L lus 1.
 */
export function normalizePairingCode(input: string): string | null {
  const code = input
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1');
  return code.length === PAIRING_CODE_LENGTH &&
    [...code].every((c) => ALPHABET.includes(c))
    ? code
    : null;
}

/**
 * Empreinte SHA-256 du code ou du secret : seule gardée en base. Le secret est
 * très aléatoire ; le code l'est moins, mais il ne sert qu'avec un Pi allumé et
 * des essais limités.
 */
export const hashPairingValue = (value: string) =>
  createHash('sha256').update(value).digest('hex');

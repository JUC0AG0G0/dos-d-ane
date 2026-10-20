const deuxChiffres = (n: number) => String(n).padStart(2, '0');

/** Chronomètre : « 04:07 », ou « 1:04:07 » au-delà d'une heure. */
export function formaterDuree(secondes: number): string {
  const h = Math.floor(secondes / 3600);
  const m = Math.floor((secondes % 3600) / 60);
  const s = secondes % 60;
  return h > 0
    ? `${h}:${deuxChiffres(m)}:${deuxChiffres(s)}`
    : `${deuxChiffres(m)}:${deuxChiffres(s)}`;
}

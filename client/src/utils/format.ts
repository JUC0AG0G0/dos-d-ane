const dateTime = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });

/** « 10 oct. 2026, 14:05 » */
export function formatDateTime(value: string | Date) {
  return dateTime.format(new Date(value));
}

/** « 10 octobre 2026 » */
export function formatDate(value: string | Date) {
  return date.format(new Date(value));
}

const shortDate = new Intl.DateTimeFormat('fr-FR');

/** « 18/10/2026 » (colonnes de tableau) */
export function formatShortDate(value: string | Date) {
  return shortDate.format(new Date(value));
}

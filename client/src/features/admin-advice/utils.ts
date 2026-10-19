/** Source envoyée à l'API : null quand le champ est vide. */
export const sourceInput = (label: string, url: string) => ({
  sourceLabel: label.trim() || null,
  sourceUrl: url.trim() || null,
});

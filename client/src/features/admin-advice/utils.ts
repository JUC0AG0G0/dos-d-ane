import { ApiError } from '@/services';

/** Message d'erreur de l'API à afficher (le premier s'il y en a plusieurs). */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 413) return 'Fichier trop lourd : 5 Mo maximum.';
    const message = (error.body as { message?: unknown } | null)?.message;
    if (Array.isArray(message) && typeof message[0] === 'string') {
      return message[0];
    }
    if (typeof message === 'string') return message;
  }
  return fallback;
}

/** Déplace un élément d'une liste (glisser-déposer). */
export function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

let lastId = 0;
/** Identifiant local d'une ligne éditable (étapes, conseils), pour le glisser-déposer. */
export const localId = () => `item-${++lastId}`;

/** Ligne d'une liste de textes éditable (étapes, conseils). */
export interface EditableItem {
  id: string;
  text: string;
}

export const toItems = (texts: string[]): EditableItem[] =>
  texts.map((text) => ({ id: localId(), text }));

/** Textes à enregistrer : sans espaces autour, lignes vides ignorées. */
export const toTexts = (items: EditableItem[]) =>
  items.map(({ text }) => text.trim()).filter(Boolean);

/** Source envoyée à l'API : null quand le champ est vide. */
export const sourceInput = (label: string, url: string) => ({
  sourceLabel: label.trim() || null,
  sourceUrl: url.trim() || null,
});

const shortDate = new Intl.DateTimeFormat('fr-FR');
/** « 18/10/2026 » (colonne Modifié le). */
export const formatShortDate = (value: string) =>
  shortDate.format(new Date(value));

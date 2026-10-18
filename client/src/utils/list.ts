/** Déplace un élément d'une liste (glisser-déposer). */
export function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

let lastId = 0;
/** Identifiant local d'une ligne éditable, pour le glisser-déposer. */
export const localId = () => `item-${++lastId}`;

/** Ligne d'une liste de textes éditable (EditableList). */
export interface EditableItem {
  id: string;
  text: string;
}

export const toItems = (texts: string[]): EditableItem[] =>
  texts.map((text) => ({ id: localId(), text }));

/** Textes à enregistrer : sans espaces autour, lignes vides ignorées. */
export const toTexts = (items: EditableItem[]) =>
  items.map(({ text }) => text.trim()).filter(Boolean);

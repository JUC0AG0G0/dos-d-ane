/**
 * Thème de l'app, relevé dans la maquette Figma « Dos d'âne — schéma partie
 * mobile ». Toutes les couleurs, polices et tailles passent par ici : changer
 * une valeur la change partout.
 */

export const couleurs = {
  fond: '#F3FAF5',
  carte: '#FFFFFF',
  bordure: '#D8EBDD',

  texte: '#10231A',
  texteSecondaire: '#5F7368',
  ongletInactif: '#9AAAA0',

  vert: '#16A34A',
  vertFonce: '#15803D',
  vertTexte: '#166534',
  vertMoyen: '#4ADE80',
  vertPale: '#BBF7D0',
  vertBordureBouton: '#86EFAC',
  vertFondIcone: '#DCFCE7',
  vertFondPastille: '#F0FDF4',
  vertSurVert: '#DCFCE7',

  blanc: '#FFFFFF',
  pointDirect: '#22C55E',
} as const;

/**
 * Couleur d'une mesure selon son niveau. Mêmes orange et rouge que les traits
 * dessinés sur la vidéo (features/analysis/posture.ts), pour que les deux concordent.
 */
export const couleursNiveau = {
  vert: couleurs.vert,
  orange: '#F39C12',
  rouge: '#E74C3C',
  gris: couleurs.ongletInactif,
} as const;

/** Noms des graisses d'Inter, chargées dans src/app/_layout.tsx. */
export const polices = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const rayons = {
  pastille: 999,
  icone: 14,
  carte: 20,
  carteMiseEnAvant: 24,
  zoneAnalyse: 28,
  bouton: 25,
} as const;

export const espaces = {
  bordEcran: 20,
  entreCartes: 16,
  interieurCarte: 20,
} as const;

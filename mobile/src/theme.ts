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

  vert: '#16A34A', // boutons, onglet actif, barre mise en avant
  vertFonce: '#15803D', // texte des boutons clairs, « Bonne »
  vertTexte: '#166534', // texte des pastilles
  vertMoyen: '#4ADE80', // « Moyenne »
  vertPale: '#BBF7D0', // barres, « À améliorer », bordure des pastilles
  vertBordureBouton: '#86EFAC', // bouton secondaire (Pause)
  vertFondIcone: '#DCFCE7', // fond des icônes, sélecteur de période
  vertFondPastille: '#F0FDF4', // pastilles, avertissement santé
  vertSurVert: '#DCFCE7', // texte clair sur la carte verte

  blanc: '#FFFFFF',
  pointDirect: '#22C55E', // point « en direct » à côté du titre de session
} as const;

/**
 * Couleur d'une mesure selon son niveau. Mêmes orange et rouge que les traits
 * dessinés sur la vidéo (public/posture.js), pour que les deux concordent.
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

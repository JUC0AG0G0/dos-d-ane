/** Parties du corps des exercices (filtre de Conseils › Exercices). */
export const EXERCISE_ZONES = [
  'nuque',
  'epaules',
  'dos',
  'poignets',
  'yeux',
  'jambes',
] as const;
export type ExerciseZone = (typeof EXERCISE_ZONES)[number];

/** Type d'exercice dans les filtres : préventif ou en cas de douleur. */
export const EXERCISE_TYPES = ['preventive', 'pain'] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const EXERCISE_POSTURES = [
  'assis',
  'debout',
  'assis ou debout',
] as const;

/** Un brouillon n'apparaît ni côté utilisateur ni dans les exercices conseillés. */
export const CONTENT_STATUSES = ['draft', 'published'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/** Les 6 réglages du poste, fixes (créés par migration). */
export const POSTURE_TIP_KEYS = [
  'ecran',
  'dossier',
  'pieds',
  'clavier',
  'lumiere',
  'pauses',
] as const;
export type PostureTipKey = (typeof POSTURE_TIP_KEYS)[number];

/** Exercices conseillés au plus par zone de douleur. */
export const MAX_ZONE_EXERCISES = 3;

export const WHEN_TO_SEE_DOCTOR_KEY = 'whenToSeeDoctor';

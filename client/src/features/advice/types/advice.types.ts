/** Contenu des Conseils, tel que renvoyé par /api/advice. */

export const EXERCISE_ZONES = [
  'nuque',
  'epaules',
  'dos',
  'poignets',
  'yeux',
  'jambes',
] as const;
export type ExerciseZone = (typeof EXERCISE_ZONES)[number];

export const ZONE_LABELS: Record<ExerciseZone, string> = {
  nuque: 'Nuque',
  epaules: 'Épaules',
  dos: 'Dos',
  poignets: 'Poignets',
  yeux: 'Yeux',
  jambes: 'Jambes',
};

/** Type d'exercice côté API. */
export type ExerciseType = 'preventive' | 'pain';

export const POSTURE_TIP_KEYS = [
  'ecran',
  'dossier',
  'pieds',
  'clavier',
  'lumiere',
  'pauses',
] as const;
export type PostureTipKey = (typeof POSTURE_TIP_KEYS)[number];

export type MediaMimeType = 'image/gif' | 'image/png' | 'video/mp4';

export interface MediaRef {
  id: string;
  mimeType: MediaMimeType;
}

export interface Source {
  sourceLabel: string | null;
  sourceUrl: string | null;
}

export interface ExerciseSummary {
  id: string;
  title: string;
  zone: ExerciseZone;
  isPreventive: boolean;
  isForPain: boolean;
  durationSeconds: number;
  posture: string;
  media: MediaRef | null;
}

export interface Exercise extends ExerciseSummary {
  precautions: string;
  steps: string[];
}

export interface ExerciseCounts {
  all: number;
  preventive: number;
  pain: number;
}

export interface ExerciseList {
  items: ExerciseSummary[];
  counts: ExerciseCounts;
}

export interface PostureTip extends Source {
  id: string;
  key: PostureTipKey;
  title: string;
  shortText: string;
  tutorialText: string;
  media: MediaRef | null;
}

export interface PainZone extends Source {
  id: string;
  name: string;
  intro: string;
  helps: string[];
  avoid: string[];
  exercises: ExerciseSummary[];
}

export interface PainZones {
  whenToSeeDoctor: string;
  zones: PainZone[];
}

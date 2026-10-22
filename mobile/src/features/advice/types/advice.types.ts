/** Exercices des Conseils, tels que renvoyés par /api/advice (mêmes types que le site web). */

export const EXERCISE_ZONES = ['nuque', 'epaules', 'dos', 'poignets', 'yeux', 'jambes'] as const;
export type ExerciseZone = (typeof EXERCISE_ZONES)[number];

export const ZONE_LABELS: Record<ExerciseZone, string> = {
  nuque: 'Nuque',
  epaules: 'Épaules',
  dos: 'Dos',
  poignets: 'Poignets',
  yeux: 'Yeux',
  jambes: 'Jambes',
};

export type MediaMimeType = 'image/gif' | 'image/png' | 'video/mp4';

export interface MediaRef {
  id: string;
  mimeType: MediaMimeType;
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

export interface ExerciseList {
  items: ExerciseSummary[];
  counts: { all: number; preventive: number; pain: number };
}

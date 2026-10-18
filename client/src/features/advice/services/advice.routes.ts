import type { ExerciseType, ExerciseZone } from '../types/advice.types';

const query = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams(
    Object.entries(params).filter(
      (entry): entry is [string, string] => !!entry[1],
    ),
  ).toString();
  return search ? `?${search}` : '';
};

export const ADVICE_ROUTES = {
  postureTips: '/advice/posture-tips',
  exercises: (type?: ExerciseType, zone?: ExerciseZone) =>
    `/advice/exercises${query({ type, zone })}`,
  exercise: (id: string) => `/advice/exercises/${encodeURIComponent(id)}`,
  painZones: '/advice/pain-zones',
  media: (id: string) => `/advice/media/${encodeURIComponent(id)}`,
} as const;

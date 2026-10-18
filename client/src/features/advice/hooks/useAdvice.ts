import { adviceService } from '../services/advice.service';
import type { ExerciseType, ExerciseZone } from '../types/advice.types';
import { useApi } from '@/hooks/useApi';

export const usePostureTips = () =>
  useApi(
    adviceService.postureTips,
    [],
    'Impossible de charger les réglages du poste.',
  );

export const useExercises = (type?: ExerciseType, zone?: ExerciseZone) =>
  useApi(
    () => adviceService.exercises(type, zone),
    [type, zone],
    'Impossible de charger les exercices.',
  );

export const usePainZones = () =>
  useApi(adviceService.painZones, [], 'Impossible de charger les repères.');

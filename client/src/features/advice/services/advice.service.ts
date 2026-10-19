import { http } from '@/services';
import type {
  Exercise,
  ExerciseList,
  ExerciseType,
  ExerciseZone,
  PainZones,
  PostureTip,
} from '../types/advice.types';
import { ADVICE_ROUTES } from './advice.routes';

export const adviceService = {
  postureTips: () => http.get<PostureTip[]>(ADVICE_ROUTES.postureTips),
  exercises: (type?: ExerciseType, zone?: ExerciseZone) =>
    http.get<ExerciseList>(ADVICE_ROUTES.exercises(type, zone)),
  exercise: (id: string) => http.get<Exercise>(ADVICE_ROUTES.exercise(id)),
  painZones: () => http.get<PainZones>(ADVICE_ROUTES.painZones),
  media: (id: string) => http.blob(ADVICE_ROUTES.media(id)),
};

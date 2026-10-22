import { chargerHistorique, situation } from '@/features/history';
import { http } from '@/services/http';

import { exercicesRecommandes, resumeSituation, type Filtre } from '../exercices';
import type { Exercise, ExerciseList } from '../types/advice.types';
import { ADVICE_ROUTES } from './advice.routes';

export const adviceService = {
  exercises: () => http.get<ExerciseList>(ADVICE_ROUTES.exercises),
  exercise: (id: string) => http.get<Exercise>(ADVICE_ROUTES.exercise(id)),
};

/** Exercices de l'écran Conseils, triés selon les postures des 7 derniers jours. */
export async function chargerConseils(filtre: Filtre) {
  const [historique, liste] = await Promise.all([chargerHistorique(), adviceService.exercises()]);
  const s = situation(historique, new Date());
  return {
    resume: resumeSituation(s),
    situation: s,
    exercices: exercicesRecommandes(liste.items, s, filtre),
  };
}

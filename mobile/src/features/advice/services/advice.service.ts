import { chargerHistorique, situation } from '@/features/history';

import { exercicesRecommandes, resumeSituation, type Filtre } from '../exercices';

/** Exercices de l'écran Conseils, triés selon les postures des 7 derniers jours. */
export async function chargerConseils(filtre: Filtre) {
  const historique = await chargerHistorique();
  const s = situation(historique, new Date());
  return { resume: resumeSituation(s), exercices: exercicesRecommandes(s, filtre) };
}

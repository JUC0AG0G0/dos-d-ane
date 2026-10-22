import { IconeActivite, IconeHorloge, IconePersonne } from '@/components/icones';
import { couleurs } from '@/styles/theme';

import type { ExerciseZone } from '../types/advice.types';

export function IconeExercice({ zone }: { zone: ExerciseZone }) {
  const couleur = couleurs.vertFonce;
  if (zone === 'nuque' || zone === 'epaules') return <IconePersonne couleur={couleur} />;
  if (zone === 'yeux') return <IconeHorloge couleur={couleur} />;
  return <IconeActivite couleur={couleur} />;
}

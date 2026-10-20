import { IconeActivite, IconeHorloge, IconePersonne } from '@/components/icones';
import { couleurs } from '@/styles/theme';

import type { Exercice } from '../exercices';

export function IconeExercice({ icone }: { icone: Exercice['icone'] }) {
  const couleur = couleurs.vertFonce;
  if (icone === 'personne') return <IconePersonne couleur={couleur} />;
  if (icone === 'horloge') return <IconeHorloge couleur={couleur} />;
  return <IconeActivite couleur={couleur} />;
}

import { IconeActivite, IconeHorloge, IconePersonne } from '@/composants/icones';
import type { Exercice } from '@/donnees/exercices';
import { couleurs } from '@/theme';

/** Icône d'un exercice (26 px, vert foncé), comme dans la maquette. */
export function IconeExercice({ icone }: { icone: Exercice['icone'] }) {
  const couleur = couleurs.vertFonce;
  if (icone === 'personne') return <IconePersonne couleur={couleur} />;
  if (icone === 'horloge') return <IconeHorloge couleur={couleur} />;
  return <IconeActivite couleur={couleur} />;
}

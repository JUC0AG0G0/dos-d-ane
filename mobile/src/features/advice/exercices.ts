/**
 * Choix des exercices et des conseils selon les postures détectées. Les
 * exercices viennent du serveur (gérés par l'admin sur le site) : ce fichier ne
 * fait que les trier. Conseils généraux de posture : ils ne remplacent pas un
 * professionnel de santé.
 *
 * Fichier sans dépendance React Native : testé par tests/statistiques.test.ts.
 */
import type { Situation } from '@/features/history';

import type { ExerciseSummary, ExerciseZone } from './types/advice.types';

export type Filtre = 'tous' | ExerciseZone;

/** Un problème compte pour les conseils s'il concerne au moins 20 % du temps. Choisi à la main. */
const PART_FREQUENTE = 0.2;

/**
 * Utilité 0–1 d'une partie du corps pour la situation : nuque, et un peu les
 * épaules, pour la tête en avant ; dos pour le buste penché ou avachi ; jambes
 * (se lever) après une longue session ; yeux et poignets en prévention.
 * Valeurs fixes choisies à la main.
 */
export function pertinence(zone: ExerciseZone, s: Situation): number {
  switch (zone) {
    case 'nuque':
      return s.teteEnAvant;
    case 'epaules':
      return s.teteEnAvant / 2;
    case 'dos':
      return Math.max(s.bustePenche, s.avachi);
    case 'jambes':
      return s.sessionLongue ? 0.5 : 0.1;
    case 'yeux':
      return 0.2;
    case 'poignets':
      return 0.1;
  }
}

/** Exercices du filtre, les plus utiles pour la situation en premier (ordre du serveur à égalité). */
export function exercicesRecommandes(
  exercices: ExerciseSummary[],
  s: Situation,
  filtre: Filtre = 'tous',
): ExerciseSummary[] {
  return exercices
    .filter((e) => filtre === 'tous' || e.zone === filtre)
    .map((e, i) => ({ e, i, p: pertinence(e.zone, s) }))
    .sort((a, b) => b.p - a.p || a.i - b.i)
    .map(({ e }) => e);
}

/** « Pour la tête en avant »… : pourquoi l'exercice est conseillé, ou null. */
export function raison(exercice: ExerciseSummary, s: Situation): string | null {
  const { zone } = exercice;
  if ((zone === 'nuque' || zone === 'epaules') && s.teteEnAvant >= PART_FREQUENTE) {
    return 'Pour la tête en avant';
  }
  if (zone === 'dos' && Math.max(s.bustePenche, s.avachi) >= PART_FREQUENTE) {
    return s.avachi > s.bustePenche ? 'Pour le dos avachi' : 'Pour le buste penché';
  }
  if (zone === 'jambes' && s.sessionLongue) return 'Pour les longues sessions';
  return null;
}

/** « 40 s », « 1 min », « 1 min 30 s » (comme le site). */
export function texteDureeExercice(secondes: number): string {
  if (secondes < 60) return `${secondes} s`;
  const minutes = Math.floor(secondes / 60);
  const reste = secondes % 60;
  return reste ? `${minutes} min ${reste} s` : `${minutes} min`;
}

const LIBELLES_PROBLEMES = {
  teteEnAvant: 'Tête en avant',
  bustePenche: 'Buste penché',
  avachi: 'Dos avachi',
} as const;

/** Problème le plus fréquent (part du temps de 0 à 1), s'il concerne au moins 20 % du temps. */
export function problemePrincipal(s: Situation): { libelle: string; part: number } | null {
  const [cle, part] = (Object.keys(LIBELLES_PROBLEMES) as (keyof typeof LIBELLES_PROBLEMES)[])
    .map((c) => [c, s[c]] as const)
    .reduce((a, b) => (b[1] > a[1] ? b : a));
  return part >= PART_FREQUENTE ? { libelle: LIBELLES_PROBLEMES[cle], part } : null;
}

/** Conseil tiré du problème le plus fréquent (accueil, bilan de session). */
export function conseilDuJour(s: Situation): string {
  if (s.secondes === 0) return 'Levez-vous 2 min toutes les heures';
  const problemes: [number, string][] = [
    [s.teteEnAvant, 'Remontez votre écran : le haut à hauteur des yeux'],
    [s.bustePenche, 'Rapprochez l’écran plutôt que de vous pencher vers lui'],
    [s.avachi, 'Asseyez-vous au fond de la chaise, le dos contre le dossier'],
  ];
  const [part, conseil] = problemes.reduce((a, b) => (b[0] > a[0] ? b : a));
  if (part >= PART_FREQUENTE) return conseil;
  if (s.sessionLongue) return 'Levez-vous 2 min toutes les heures';
  return 'Gardez ce rythme : une pause toutes les heures';
}

export function resumeSituation(s: Situation): string {
  if (s.secondes === 0) return 'Faites une session pour recevoir des conseils adaptés.';
  const pct = (x: number) => `${Math.round(x * 100)} %`;
  return `Ces 7 derniers jours : tête en avant ${pct(s.teteEnAvant)} du temps, buste penché ${pct(s.bustePenche)}, dos avachi ${pct(s.avachi)}.`;
}

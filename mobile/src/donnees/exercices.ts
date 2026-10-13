/**
 * Catalogue d'exercices et choix des conseils selon les postures détectées.
 * Conseils généraux de posture : ils ne remplacent pas un professionnel de santé.
 *
 * Fichier sans dépendance React Native : testé par scripts/statistiques.test.ts.
 */
import type { Situation } from './statistiques';

export type Filtre = 'tous' | 'cou' | 'dos' | 'epaules';
export type Cible = 'teteEnAvant' | 'bustePenche' | 'avachi' | 'immobilite' | 'toutes';

export type Exercice = {
  id: string;
  titre: string;
  duree: string;
  zone: string;
  filtre: Exclude<Filtre, 'tous'> | null;
  cible: Cible;
  icone: 'personne' | 'activite' | 'horloge';
  pourquoi: string;
  etapes: string[];
};

export const PASTILLE_CIBLE: Record<Cible, string> = {
  teteEnAvant: 'Tête en avant',
  bustePenche: 'Flexion du tronc',
  avachi: 'Dos avachi',
  immobilite: 'Immobilité',
  toutes: 'Toutes postures',
};

export const EXERCICES: Exercice[] = [
  {
    id: 'retraction-menton',
    titre: 'Rétraction du menton',
    duree: '2 min',
    zone: 'Cou',
    filtre: 'cou',
    cible: 'teteEnAvant',
    icone: 'personne',
    pourquoi:
      'Quand la tête avance vers l’écran, les muscles de la nuque travaillent davantage. Ce mouvement ramène la tête au-dessus des épaules.',
    etapes: [
      'Asseyez-vous droit, le regard à l’horizontale.',
      'Reculez doucement le menton, comme pour faire un double menton, sans baisser la tête.',
      'Tenez 5 secondes, puis relâchez.',
      'Répétez 10 fois, sans forcer.',
    ],
  },
  {
    id: 'etirement-trapezes',
    titre: 'Étirement du haut des épaules',
    duree: '2 min',
    zone: 'Cou et épaules',
    filtre: 'epaules',
    cible: 'teteEnAvant',
    icone: 'personne',
    pourquoi: 'La tête en avant tend le haut des épaules. Un étirement doux relâche cette zone.',
    etapes: [
      'Assis, posez la main droite sous la cuisse droite.',
      'Inclinez doucement l’oreille gauche vers l’épaule gauche.',
      'Tenez 20 secondes en respirant calmement.',
      'Changez de côté. Faites 2 fois chaque côté.',
    ],
  },
  {
    id: 'ouverture-thoracique',
    titre: 'Ouverture thoracique',
    duree: '3 min',
    zone: 'Épaules et dos',
    filtre: 'dos',
    cible: 'bustePenche',
    icone: 'activite',
    pourquoi:
      'Rester penché vers l’avant ferme la poitrine et arrondit le haut du dos. Ce mouvement l’ouvre à nouveau.',
    etapes: [
      'Asseyez-vous au bord de la chaise, pieds à plat.',
      'Mains derrière la tête, écartez les coudes.',
      'Ouvrez la poitrine vers le haut en inspirant, sans creuser le bas du dos.',
      'Tenez 5 respirations, relâchez. Répétez 5 fois.',
    ],
  },
  {
    id: 'extension-dossier',
    titre: 'Extension sur le dossier',
    duree: '2 min',
    zone: 'Dos',
    filtre: 'dos',
    cible: 'bustePenche',
    icone: 'activite',
    pourquoi: 'Ce mouvement compense la flexion du buste prolongée devant l’écran.',
    etapes: [
      'Asseyez-vous au fond de la chaise, le haut du dos contre le dossier.',
      'Croisez les bras sur la poitrine.',
      'Penchez doucement le haut du dos vers l’arrière, au-dessus du dossier.',
      'Tenez 5 secondes, revenez. Répétez 8 fois.',
    ],
  },
  {
    id: 'bascule-bassin',
    titre: 'Bascule du bassin assis',
    duree: '2 min',
    zone: 'Bas du dos',
    filtre: 'dos',
    cible: 'avachi',
    icone: 'activite',
    pourquoi:
      'Avachi, le bassin bascule vers l’arrière et le bas du dos s’arrondit. Ce mouvement réapprend à placer le bassin.',
    etapes: [
      'Asseyez-vous au bord de la chaise, pieds à plat, mains sur les cuisses.',
      'Basculez doucement le bassin vers l’arrière : le dos s’arrondit.',
      'Puis vers l’avant : le bas du dos se creuse légèrement.',
      'Faites 10 allers-retours lents, puis arrêtez-vous au milieu, dos droit.',
    ],
  },
  {
    id: 'assise-fond-chaise',
    titre: 'S’asseoir au fond de la chaise',
    duree: '1 min',
    zone: 'Dos',
    filtre: 'dos',
    cible: 'avachi',
    icone: 'personne',
    pourquoi:
      'Glisser vers l’avant de l’assise pousse à s’avachir. Le dossier soutient le dos seulement si l’on est assis au fond.',
    etapes: [
      'Levez-vous à moitié, reculez les fesses jusqu’au fond de l’assise.',
      'Laissez le bas du dos toucher le dossier.',
      'Pieds à plat, genoux à peu près à hauteur des hanches.',
      'Reprenez cette position à chaque fois que vous vous surprenez à glisser.',
    ],
  },
  {
    id: 'rotation-epaules',
    titre: 'Rotation des épaules',
    duree: '1 min',
    zone: 'Épaules',
    filtre: 'epaules',
    cible: 'toutes',
    icone: 'activite',
    pourquoi: 'Bouger les épaules régulièrement relâche les tensions de la position assise.',
    etapes: [
      'Bras le long du corps, montez les épaules vers les oreilles.',
      'Faites-les rouler vers l’arrière puis vers le bas, lentement.',
      'Faites 10 cercles, puis 5 dans l’autre sens.',
    ],
  },
  {
    id: 'pause-20-20-20',
    titre: 'Pause active 20-20-20',
    duree: '1 min',
    zone: 'Yeux et nuque',
    filtre: null,
    cible: 'toutes',
    icone: 'horloge',
    pourquoi:
      'Toutes les 20 minutes, une courte pause repose les yeux et invite à changer de position.',
    etapes: [
      'Toutes les 20 minutes, quittez l’écran des yeux.',
      'Regardez un point éloigné (environ 6 mètres) pendant 20 secondes.',
      'Profitez-en pour vous redresser et relâcher les épaules.',
    ],
  },
  {
    id: 'pause-marche',
    titre: 'Levez-vous et marchez',
    duree: '2 min',
    zone: 'Tout le corps',
    filtre: null,
    cible: 'immobilite',
    icone: 'horloge',
    pourquoi:
      'Rester assis longtemps sans bouger fatigue le dos. Se lever régulièrement est l’un des conseils les plus simples.',
    etapes: [
      'Toutes les heures, levez-vous.',
      'Marchez 2 minutes : remplir un verre d’eau, faire quelques pas.',
      'Revenez vous asseoir au fond de la chaise.',
    ],
  },
];

/** Pertinence 0–1 d'un exercice pour la situation (plus haut = plus utile). */
export function pertinence(exercice: Exercice, s: Situation): number {
  switch (exercice.cible) {
    case 'teteEnAvant':
      return s.teteEnAvant;
    case 'bustePenche':
      return s.bustePenche;
    case 'avachi':
      return s.avachi;
    case 'immobilite':
      return s.sessionLongue ? 0.5 : 0.1;
    case 'toutes':
      return 0.2;
  }
}

/** Exercices du filtre, les plus utiles pour la situation en premier. */
export function exercicesRecommandes(s: Situation, filtre: Filtre = 'tous'): Exercice[] {
  return EXERCICES.filter((e) => filtre === 'tous' || e.filtre === filtre)
    .map((e, i) => ({ e, i, p: pertinence(e, s) }))
    .sort((a, b) => b.p - a.p || a.i - b.i)
    .map(({ e }) => e);
}

/** Conseil du jour de l'accueil, tiré du problème le plus fréquent. */
export function conseilDuJour(s: Situation): string {
  if (s.secondes === 0) return 'Levez-vous 2 min toutes les heures';
  const problemes: [number, string][] = [
    [s.teteEnAvant, 'Remontez votre écran : le haut à hauteur des yeux'],
    [s.bustePenche, 'Rapprochez l’écran plutôt que de vous pencher vers lui'],
    [s.avachi, 'Asseyez-vous au fond de la chaise, le dos contre le dossier'],
  ];
  // Le problème le plus fréquent, s'il concerne au moins 20 % du temps.
  const [part, conseil] = problemes.reduce((a, b) => (b[0] > a[0] ? b : a));
  if (part >= 0.2) return conseil;
  if (s.sessionLongue) return 'Levez-vous 2 min toutes les heures';
  return 'Gardez ce rythme : une pause toutes les heures';
}

export function resumeSituation(s: Situation): string {
  if (s.secondes === 0) return 'Faites une session pour recevoir des conseils adaptés.';
  const pct = (x: number) => `${Math.round(x * 100)} %`;
  return `Ces 7 derniers jours : tête en avant ${pct(s.teteEnAvant)} du temps, buste penché ${pct(s.bustePenche)}, dos avachi ${pct(s.avachi)}.`;
}

export function trouverExercice(id: string): Exercice | undefined {
  return EXERCICES.find((e) => e.id === id);
}

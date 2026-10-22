/**
 * Statistiques de posture, calculées sur le téléphone à partir des mesures de
 * session. Aucune image : seulement des angles, des couleurs et des durées.
 *
 * Les mesures sont cumulées par TRANCHE D'UNE HEURE (assez fin pour le
 * graphique par heure, assez léger pour garder un an d'historique). Chaque
 * mesure compte pour sa durée : une mesure tenue 1 s compte 4 fois plus
 * qu'une mesure tenue 0,25 s. Le résultat d'une période est la part du temps
 * passée en bonne posture (cou et tronc verts).
 *
 * Fichier sans dépendance React Native : testé par tests/statistiques.test.ts.
 */

import type { Niveau, SensTronc } from '@/features/analysis';

export type Periode = 'jour' | 'semaine' | 'mois';

export type Tranche = {
  /** Début de l'heure, en millisecondes (heure locale du téléphone). */
  debut: number;
  /** Temps mesuré, en secondes (au moins un angle disponible). */
  secondes: number;
  couSomme: number;
  couSecondes: number;
  troncSomme: number;
  troncSecondes: number;
  /** Secondes passées en bonne posture, moyenne, à améliorer (pire des deux mesures). */
  bonne: number;
  moyenne: number;
  ameliorer: number;
  /** Secondes où le cou (tête en avant) ou le tronc était orange ou rouge. */
  couAlerte: number;
  troncAlerte: number;
  /**
   * Dont secondes avec le buste incliné vers l'arrière (avachi). Absent des
   * tranches enregistrées avant l'ajout du sens du tronc : compté comme 0.
   */
  troncArriere?: number;
};

/**
 * Session terminée. `secondes` : durée active (sans les pauses). `bilan` et
 * `serveur` (id de la session sur le serveur) sont absents des sessions
 * enregistrées avant l'écran de bilan, ou si le serveur était injoignable.
 */
export type SessionEnregistree = {
  debut: number;
  fin: number;
  secondes: number;
  bilan?: BilanSession;
  serveur?: string;
};

export type Historique = { tranches: Tranche[]; sessions: SessionEnregistree[] };

export type Echantillon = {
  /** Instant de la mesure, en millisecondes. */
  instant: number;
  /** Durée représentée par cette mesure, en secondes. */
  duree: number;
  cou: { angle: number | null; niveau: Niveau };
  tronc: { angle: number | null; niveau: Niveau; sens?: SensTronc };
};

const HEURE = 3600 * 1000;

export function debutHeure(instant: number): number {
  const d = new Date(instant);
  d.setMinutes(0, 0, 0);
  return d.getTime();
}

function trancheVide(debut: number): Tranche {
  return {
    debut,
    secondes: 0,
    couSomme: 0,
    couSecondes: 0,
    troncSomme: 0,
    troncSecondes: 0,
    bonne: 0,
    moyenne: 0,
    ameliorer: 0,
    couAlerte: 0,
    troncAlerte: 0,
    troncArriere: 0,
  };
}

/** Pire niveau mesuré -> catégorie de la répartition ; null si rien de mesuré. */
function categorie(a: Niveau, b: Niveau): 'bonne' | 'moyenne' | 'ameliorer' | null {
  if (a === 'rouge' || b === 'rouge') return 'ameliorer';
  if (a === 'orange' || b === 'orange') return 'moyenne';
  if (a === 'vert' || b === 'vert') return 'bonne';
  return null;
}

const enAlerte = (n: Niveau) => n === 'orange' || n === 'rouge';

/** Ajoute une mesure à la tranche de son heure (créée au besoin). */
export function ajouterEchantillon(tranches: Map<number, Tranche>, e: Echantillon): void {
  if (!(e.duree > 0)) return;
  const cat = categorie(e.cou.niveau, e.tronc.niveau);
  if (!cat) return;

  const cle = debutHeure(e.instant);
  const t = tranches.get(cle) ?? trancheVide(cle);
  t.secondes += e.duree;
  if (e.cou.angle !== null) {
    t.couSomme += e.cou.angle * e.duree;
    t.couSecondes += e.duree;
  }
  if (e.tronc.angle !== null) {
    t.troncSomme += e.tronc.angle * e.duree;
    t.troncSecondes += e.duree;
  }
  t[cat] += e.duree;
  // Au-delà de 90°, la tête est en arrière : ce n'est pas de la tête en avant.
  if (enAlerte(e.cou.niveau) && (e.cou.angle ?? 0) <= 90) t.couAlerte += e.duree;
  if (enAlerte(e.tronc.niveau)) {
    t.troncAlerte += e.duree;
    if (e.tronc.sens === 'arriere') t.troncArriere = (t.troncArriere ?? 0) + e.duree;
  }
  tranches.set(cle, t);
}

/** Fusionne des tranches (même heure : on additionne). Résultat trié. */
export function fusionnerTranches(a: Tranche[], b: Iterable<Tranche>): Tranche[] {
  const parHeure = new Map<number, Tranche>();
  for (const t of [...a, ...b]) {
    const existante = parHeure.get(t.debut);
    if (!existante) {
      parHeure.set(t.debut, { ...t });
      continue;
    }
    for (const cle of Object.keys(t) as (keyof Tranche)[]) {
      if (cle !== 'debut') existante[cle] = (existante[cle] ?? 0) + (t[cle] ?? 0);
    }
  }
  return [...parHeure.values()].sort((x, y) => x.debut - y.debut);
}

/** Début (inclus) et fin (exclue) de la période qui contient `ref`. */
export function bornes(periode: Periode, ref: Date): { debut: Date; fin: Date } {
  const debut = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  if (periode === 'jour') {
    return { debut, fin: new Date(debut.getFullYear(), debut.getMonth(), debut.getDate() + 1) };
  }
  if (periode === 'semaine') {
    const decalage = (debut.getDay() + 6) % 7; // lundi = 0
    debut.setDate(debut.getDate() - decalage);
    return { debut, fin: new Date(debut.getFullYear(), debut.getMonth(), debut.getDate() + 7) };
  }
  const premier = new Date(ref.getFullYear(), ref.getMonth(), 1);
  return { debut: premier, fin: new Date(ref.getFullYear(), ref.getMonth() + 1, 1) };
}

/** Même période, `n` crans avant (n < 0) ou après (n > 0). */
export function decaler(periode: Periode, ref: Date, n: number): Date {
  if (periode === 'jour') return new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + n);
  if (periode === 'semaine') {
    return new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + 7 * n);
  }
  return new Date(ref.getFullYear(), ref.getMonth() + n, 1);
}

type Totaux = Omit<Tranche, 'debut'>;

function totaliser(tranches: Tranche[]): Totaux {
  const total = trancheVide(0) as Tranche;
  for (const t of tranches) {
    for (const cle of Object.keys(t) as (keyof Tranche)[]) {
      if (cle !== 'debut') total[cle] = (total[cle] ?? 0) + (t[cle] ?? 0);
    }
  }
  const { debut: _debut, ...reste } = total;
  return reste;
}

/** Part du temps en bonne posture, de 0 à 100 ; null si rien n'a été mesuré. */
function partBonne(t: Totaux): number | null {
  const categorise = t.bonne + t.moyenne + t.ameliorer;
  return categorise > 0 ? (100 * t.bonne) / categorise : null;
}

/** Pourcentages entiers dont la somme fait 100 ; null si rien n'a été mesuré. */
function repartitionDe(t: Totaux): Resume['repartition'] {
  const categorise = t.bonne + t.moyenne + t.ameliorer;
  if (categorise <= 0) return null;
  const bonne = Math.round((100 * t.bonne) / categorise);
  const moyenne = Math.min(100 - bonne, Math.round((100 * t.moyenne) / categorise));
  return { bonne, moyenne, ameliorer: 100 - bonne - moyenne };
}

/** Part du temps (0–1) avec la tête en avant, le buste penché, le dos avachi. */
function partsProblemes(t: Totaux): Pick<Situation, 'teteEnAvant' | 'bustePenche' | 'avachi'> {
  const arriere = t.troncArriere ?? 0;
  return {
    teteEnAvant: t.couSecondes > 0 ? t.couAlerte / t.couSecondes : 0,
    bustePenche: t.troncSecondes > 0 ? (t.troncAlerte - arriere) / t.troncSecondes : 0,
    avachi: t.troncSecondes > 0 ? arriere / t.troncSecondes : 0,
  };
}

function anglesMoyensDe(t: Totaux): Resume['anglesMoyens'] {
  return {
    cou: t.couSecondes > 0 ? t.couSomme / t.couSecondes : null,
    tronc: t.troncSecondes > 0 ? t.troncSomme / t.troncSecondes : null,
  };
}

function dans(tranches: Tranche[], debut: Date, fin: Date): Tranche[] {
  const a = debut.getTime();
  const b = fin.getTime();
  return tranches.filter((t) => t.debut >= a && t.debut < b);
}

/** `bonne` : part du temps en bonne posture, de 0 à 100. */
export type Barre = { libelle: string; bonne: number | null; misEnAvant: boolean };

export type Resume = {
  /** Part du temps en bonne posture, de 0 à 100, arrondie ; null si aucune mesure. */
  bonne: number | null;
  /** Écart avec la période précédente, en points de % ; null si l'une des deux est vide. */
  ecart: number | null;
  secondes: number;
  /** Pourcentages entiers dont la somme fait 100 ; null si aucune mesure. */
  repartition: { bonne: number; moyenne: number; ameliorer: number } | null;
  barres: Barre[];
  anglesMoyens: { cou: number | null; tronc: number | null };
};

const JOURS_COURTS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function barres(periode: Periode, tranches: Tranche[], debut: Date, fin: Date): Barre[] {
  const groupes: { libelle: string; debut: number; fin: number }[] = [];
  if (periode === 'jour') {
    const heures = tranches.map((t) => new Date(t.debut).getHours());
    const premiere = Math.min(9, ...heures);
    const derniere = Math.max(17, ...heures);
    for (let h = premiere; h <= derniere; h++) {
      const d = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate(), h).getTime();
      groupes.push({ libelle: `${h}h`, debut: d, fin: d + HEURE });
    }
  } else if (periode === 'semaine') {
    for (let j = 0; j < 7; j++) {
      const d = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate() + j);
      const f = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate() + j + 1);
      groupes.push({ libelle: JOURS_COURTS[j], debut: d.getTime(), fin: f.getTime() });
    }
  } else {
    // Semaines du mois : jours 1–7 = S1, 8–14 = S2…
    for (let s = 0; debut.getDate() + 7 * s <= 31; s++) {
      const d = new Date(debut.getFullYear(), debut.getMonth(), 1 + 7 * s);
      if (d >= fin) break;
      const f = new Date(
        Math.min(fin.getTime(), new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime()),
      );
      groupes.push({ libelle: `S${s + 1}`, debut: d.getTime(), fin: f.getTime() });
    }
  }

  const resultat = groupes.map((g) => {
    const dedans = tranches.filter((t) => t.debut >= g.debut && t.debut < g.fin);
    const bonne = partBonne(totaliser(dedans));
    return {
      libelle: g.libelle,
      bonne: bonne === null ? null : Math.round(bonne),
      misEnAvant: false,
    };
  });
  // La barre mise en avant (vert foncé) est la plus récente qui a des données.
  for (let i = resultat.length - 1; i >= 0; i--) {
    if (resultat[i].bonne !== null) {
      resultat[i].misEnAvant = true;
      break;
    }
  }
  return resultat;
}

/** Résumé d'une période : temps en bonne posture, écart, temps suivi, répartition, barres. */
export function resumer(tranches: Tranche[], periode: Periode, ref: Date): Resume {
  const { debut, fin } = bornes(periode, ref);
  const courantes = dans(tranches, debut, fin);
  const total = totaliser(courantes);
  const bonne = partBonne(total);

  const avant = bornes(periode, decaler(periode, ref, -1));
  const bonneAvant = partBonne(totaliser(dans(tranches, avant.debut, avant.fin)));

  return {
    bonne: bonne === null ? null : Math.round(bonne),
    ecart:
      bonne === null || bonneAvant === null ? null : Math.round(bonne) - Math.round(bonneAvant),
    secondes: total.secondes,
    repartition: repartitionDe(total),
    barres: barres(periode, courantes, debut, fin),
    anglesMoyens: anglesMoyensDe(total),
  };
}

/** Bilan d'une seule session, gardé avec elle sur le téléphone. */
export type BilanSession = Pick<Situation, 'teteEnAvant' | 'bustePenche' | 'avachi'> & {
  /** Temps où la posture a été mesurée, en secondes. */
  secondes: number;
  /** Part du temps en bonne posture, de 0 à 100, arrondie ; null si rien n'a été mesuré. */
  bonne: number | null;
  repartition: Resume['repartition'];
  anglesMoyens: Resume['anglesMoyens'];
};

export function bilanSession(tranches: Iterable<Tranche>): BilanSession {
  const total = totaliser([...tranches]);
  const bonne = partBonne(total);
  return {
    secondes: total.secondes,
    bonne: bonne === null ? null : Math.round(bonne),
    repartition: repartitionDe(total),
    anglesMoyens: anglesMoyensDe(total),
    ...partsProblemes(total),
  };
}

/** Situation d'une seule session, pour choisir ses conseils et ses exercices. */
export function situationSession(session: SessionEnregistree): Situation {
  const bilan = session.bilan;
  return {
    secondes: bilan?.secondes ?? 0,
    teteEnAvant: bilan?.teteEnAvant ?? 0,
    bustePenche: bilan?.bustePenche ?? 0,
    avachi: bilan?.avachi ?? 0,
    sessionLongue: session.secondes >= SESSION_LONGUE_SECONDES,
  };
}

export type Situation = {
  /** Temps mesuré sur la fenêtre, en secondes. */
  secondes: number;
  /** Part du temps (0–1) avec la tête en avant, avec le buste penché. */
  teteEnAvant: number;
  /** Buste penché vers l'avant (ou sens inconnu). */
  bustePenche: number;
  /** Buste avachi vers l'arrière. */
  avachi: number;
  /** Une session d'au moins 50 min sans interruption sur la fenêtre. */
  sessionLongue: boolean;
};

export const SESSION_LONGUE_SECONDES = 50 * 60;

/** Bilan des `jours` derniers jours, pour personnaliser les conseils. */
export function situation(historique: Historique, maintenant: Date, jours = 7): Situation {
  const depuis = new Date(
    maintenant.getFullYear(),
    maintenant.getMonth(),
    maintenant.getDate() - (jours - 1),
  );
  const total = totaliser(historique.tranches.filter((t) => t.debut >= depuis.getTime()));
  return {
    secondes: total.secondes,
    ...partsProblemes(total),
    sessionLongue: historique.sessions.some(
      (s) => s.fin >= depuis.getTime() && s.secondes >= SESSION_LONGUE_SECONDES,
    ),
  };
}

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];
const MOIS_COURTS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

/** « Mercredi 7 oct. 2026 », « 5 – 11 oct. 2026 », « Octobre 2026 ». */
export function libellePeriode(periode: Periode, ref: Date): string {
  const { debut, fin } = bornes(periode, ref);
  if (periode === 'jour') {
    return `${JOURS[debut.getDay()]} ${debut.getDate()} ${MOIS_COURTS[debut.getMonth()]} ${debut.getFullYear()}`;
  }
  if (periode === 'semaine') {
    const dernier = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate() - 1);
    const memeMois = debut.getMonth() === dernier.getMonth();
    const gauche = memeMois
      ? `${debut.getDate()}`
      : `${debut.getDate()} ${MOIS_COURTS[debut.getMonth()]}`;
    return `${gauche} – ${dernier.getDate()} ${MOIS_COURTS[dernier.getMonth()]} ${dernier.getFullYear()}`;
  }
  const mois = MOIS[debut.getMonth()];
  return `${mois[0].toUpperCase()}${mois.slice(1)} ${debut.getFullYear()}`;
}

/** « 45 min », « 6 h 10 », « 31 h 40 », « 128 h ». */
export function texteDuree(secondes: number): string {
  const minutes = Math.round(secondes / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h >= 100 || m === 0) return `${h} h`;
  return `${h} h ${String(m).padStart(2, '0')}`;
}

export const REFERENCE_PRECEDENTE: Record<Periode, string> = {
  jour: 'hier',
  semaine: 'sem. préc.',
  mois: 'mois préc.',
};

/** « +6 pts vs hier », « −3 pts vs hier », « = hier ». */
export function texteEcart(ecart: number, reference: string): string {
  if (ecart === 0) return `= ${reference}`;
  const signe = ecart > 0 ? '+' : '−';
  return `${signe}${Math.abs(ecart)} pts vs ${reference}`;
}

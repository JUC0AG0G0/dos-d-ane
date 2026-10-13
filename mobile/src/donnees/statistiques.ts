/**
 * Statistiques de posture, calculées sur le téléphone à partir des mesures de
 * session. Aucune image : seulement des scores, des angles et des durées.
 *
 * Les mesures sont cumulées par TRANCHE D'UNE HEURE (assez fin pour le
 * graphique « Score par heure », assez léger pour garder un an d'historique).
 * Chaque somme est pondérée par le temps : une mesure tenue 1 s compte 4 fois
 * plus qu'une mesure tenue 0,25 s. Le score d'une période est donc la moyenne
 * dans le temps du score instantané, lui-même calculé à partir des angles
 * (public/posture.js, noteMesure).
 *
 * Fichier sans dépendance React Native : testé par scripts/test-statistiques.mjs.
 */

export type Niveau = 'vert' | 'orange' | 'rouge' | 'gris';
export type Periode = 'jour' | 'semaine' | 'mois';

export type Tranche = {
  /** Début de l'heure, en millisecondes (heure locale du téléphone). */
  debut: number;
  /** Temps mesuré, en secondes (au moins un angle disponible). */
  secondes: number;
  /** Σ score × secondes. */
  scoreSomme: number;
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

export type SessionEnregistree = { debut: number; fin: number; secondes: number };

export type Historique = { tranches: Tranche[]; sessions: SessionEnregistree[] };

export type Echantillon = {
  /** Instant de la mesure, en millisecondes. */
  instant: number;
  /** Durée représentée par cette mesure, en secondes. */
  duree: number;
  score: number;
  cou: { angle: number | null; niveau: Niveau };
  tronc: { angle: number | null; niveau: Niveau; sens?: 'avant' | 'arriere' | null };
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
    scoreSomme: 0,
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
  if (!(e.duree > 0) || !isFinite(e.score)) return;
  const cat = categorie(e.cou.niveau, e.tronc.niveau);
  if (!cat) return;

  const cle = debutHeure(e.instant);
  const t = tranches.get(cle) ?? trancheVide(cle);
  t.secondes += e.duree;
  t.scoreSomme += e.score * e.duree;
  if (e.cou.angle !== null) {
    t.couSomme += e.cou.angle * e.duree;
    t.couSecondes += e.duree;
  }
  if (e.tronc.angle !== null) {
    t.troncSomme += e.tronc.angle * e.duree;
    t.troncSecondes += e.duree;
  }
  t[cat] += e.duree;
  if (enAlerte(e.cou.niveau)) t.couAlerte += e.duree;
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

// ---------------------------------------------------------------------------
// Périodes
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Résumés
// ---------------------------------------------------------------------------

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

const scoreDe = (t: Totaux) => (t.secondes > 0 ? t.scoreSomme / t.secondes : null);

function dans(tranches: Tranche[], debut: Date, fin: Date): Tranche[] {
  const a = debut.getTime();
  const b = fin.getTime();
  return tranches.filter((t) => t.debut >= a && t.debut < b);
}

export type Barre = { libelle: string; score: number | null; misEnAvant: boolean };

export type Resume = {
  /** Score moyen 0–100, arrondi ; null si aucune mesure. */
  score: number | null;
  /** Écart avec la période précédente, en points ; null si l'une des deux est vide. */
  ecart: number | null;
  secondes: number;
  /** Pourcentages entiers dont la somme fait 100 ; null si aucune mesure. */
  repartition: { bonne: number; moyenne: number; ameliorer: number } | null;
  barres: Barre[];
  anglesMoyens: { cou: number | null; tronc: number | null };
};

const JOURS_COURTS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function barres(periode: Periode, tranches: Tranche[], debut: Date, fin: Date): Barre[] {
  // Groupes [début, fin) et leur libellé.
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
    const score = scoreDe(totaliser(tranches.filter((t) => t.debut >= g.debut && t.debut < g.fin)));
    return {
      libelle: g.libelle,
      score: score === null ? null : Math.round(score),
      misEnAvant: false,
    };
  });
  // La barre mise en avant (vert foncé) est la plus récente qui a des données.
  for (let i = resultat.length - 1; i >= 0; i--) {
    if (resultat[i].score !== null) {
      resultat[i].misEnAvant = true;
      break;
    }
  }
  return resultat;
}

/** Résumé d'une période : score moyen, écart, temps suivi, répartition, barres. */
export function resumer(tranches: Tranche[], periode: Periode, ref: Date): Resume {
  const { debut, fin } = bornes(periode, ref);
  const courantes = dans(tranches, debut, fin);
  const total = totaliser(courantes);
  const score = scoreDe(total);

  const avant = bornes(periode, decaler(periode, ref, -1));
  const scoreAvant = scoreDe(totaliser(dans(tranches, avant.debut, avant.fin)));

  let repartition: Resume['repartition'] = null;
  const categorise = total.bonne + total.moyenne + total.ameliorer;
  if (categorise > 0) {
    const bonne = Math.round((100 * total.bonne) / categorise);
    const moyenne = Math.min(100 - bonne, Math.round((100 * total.moyenne) / categorise));
    repartition = { bonne, moyenne, ameliorer: 100 - bonne - moyenne };
  }

  return {
    score: score === null ? null : Math.round(score),
    ecart:
      score === null || scoreAvant === null ? null : Math.round(score) - Math.round(scoreAvant),
    secondes: total.secondes,
    repartition,
    barres: barres(periode, courantes, debut, fin),
    anglesMoyens: {
      cou: total.couSecondes > 0 ? total.couSomme / total.couSecondes : null,
      tronc: total.troncSecondes > 0 ? total.troncSomme / total.troncSecondes : null,
    },
  };
}

// ---------------------------------------------------------------------------
// Situation : ce qui sert à choisir les conseils
// ---------------------------------------------------------------------------

export type Situation = {
  /** Temps mesuré sur la fenêtre, en secondes. */
  secondes: number;
  score: number | null;
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
    score: scoreDe(total) === null ? null : Math.round(scoreDe(total)!),
    teteEnAvant: total.couSecondes > 0 ? total.couAlerte / total.couSecondes : 0,
    bustePenche:
      total.troncSecondes > 0
        ? (total.troncAlerte - (total.troncArriere ?? 0)) / total.troncSecondes
        : 0,
    avachi: total.troncSecondes > 0 ? (total.troncArriere ?? 0) / total.troncSecondes : 0,
    sessionLongue: historique.sessions.some(
      (s) => s.fin >= depuis.getTime() && s.secondes >= SESSION_LONGUE_SECONDES,
    ),
  };
}

// ---------------------------------------------------------------------------
// Textes
// ---------------------------------------------------------------------------

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

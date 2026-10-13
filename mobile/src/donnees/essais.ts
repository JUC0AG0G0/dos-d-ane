/**
 * Test des seuils avec des volontaires : chaque participant (code P01, P02…,
 * jamais de nom) tient 4 postures connues pendant 30 s. On enregistre les
 * angles mesurés (jamais d'image) pour vérifier que les couleurs de l'app
 * correspondent à la posture demandée, et ajuster les seuils au besoin.
 *
 * Fichier sans dépendance React Native : testé par scripts/test-essais.mjs.
 */

export type Niveau = 'vert' | 'orange' | 'rouge' | 'gris';
export type PostureTest = 'droit' | 'teteAvant' | 'pencheAvant' | 'avachi';
export type SensTronc = 'avant' | 'arriere' | null;

const enAlerte = (n: Niveau) => n === 'orange' || n === 'rouge';

export const POSTURES_TEST: {
  id: PostureTest;
  titre: string;
  consigne: string;
  /** Ce que l'app doit détecter pour que la mesure soit jugée correcte. */
  attendu: string;
  reussie: (cou: Niveau, tronc: Niveau, sensTronc?: SensTronc) => boolean;
}[] = [
  {
    id: 'droit',
    titre: 'Bien droit',
    consigne: 'Asseyez-vous au fond de la chaise, le dos droit, le regard à l’horizontale.',
    attendu: 'cou et tronc en vert',
    reussie: (cou, tronc) => cou === 'vert' && tronc === 'vert',
  },
  {
    id: 'teteAvant',
    titre: 'Tête en avant',
    consigne: 'Gardez le dos droit et avancez la tête vers l’écran, comme pour lire de près.',
    attendu: 'cou en orange ou rouge',
    reussie: (cou) => enAlerte(cou),
  },
  {
    id: 'pencheAvant',
    titre: 'Penché en avant',
    consigne: 'Penchez tout le buste vers l’avant, comme pour vous rapprocher du bureau.',
    attendu: 'tronc en orange ou rouge',
    // Un sens « arrière » détecté est une erreur ; un sens inconnu (nez mal vu,
    // ou mesure enregistrée avant l'ajout du sens) est toléré.
    reussie: (_cou, tronc, sens) => enAlerte(tronc) && sens !== 'arriere',
  },
  {
    id: 'avachi',
    titre: 'Avachi en arrière',
    consigne: 'Glissez vers l’avant de l’assise et laissez le dos s’enfoncer vers l’arrière.',
    attendu: 'tronc en orange ou rouge, incliné vers l’arrière',
    reussie: (_cou, tronc, sens) => enAlerte(tronc) && sens !== 'avant',
  },
];

export const NOMBRE_PARTICIPANTS_VISE = 3;

export type EchantillonTest = {
  /** Millisecondes depuis le début de l'enregistrement. */
  t: number;
  /** Faux si personne n'est détecté ou si aucun angle n'est mesurable. */
  mesurable: boolean;
  cote: 'gauche' | 'droite' | null;
  score: number | null;
  cou: { angle: number | null; niveau: Niveau };
  tronc: { angle: number | null; niveau: Niveau; sens?: SensTronc };
};

export type EnregistrementTest = {
  participant: string;
  posture: PostureTest;
  /** Début de l'enregistrement, en millisecondes. */
  debut: number;
  echantillons: EchantillonTest[];
};

export type Participant = { code: string; consentement: true; date: number };

export type Essais = { participants: Participant[]; enregistrements: EnregistrementTest[] };

/** P01, P02… : premier code libre. */
export function prochainCode(participants: Participant[]): string {
  const pris = new Set(participants.map((p) => p.code));
  for (let i = 1; ; i++) {
    const code = `P${String(i).padStart(2, '0')}`;
    if (!pris.has(code)) return code;
  }
}

// ---------------------------------------------------------------------------
// Résumés
// ---------------------------------------------------------------------------

export type Stats = { moyenne: number; min: number; max: number; n: number };

export function stats(valeurs: number[]): Stats | null {
  if (!valeurs.length) return null;
  let somme = 0;
  let min = Infinity;
  let max = -Infinity;
  for (const v of valeurs) {
    somme += v;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return { moyenne: somme / valeurs.length, min, max, n: valeurs.length };
}

const angles = (echantillons: EchantillonTest[], partie: 'cou' | 'tronc') =>
  echantillons
    .filter((e) => e.mesurable && e.cou && e[partie].angle !== null)
    .map((e) => e[partie].angle as number);

export type ResumeEnregistrement = {
  mesures: number;
  mesurables: number;
  cou: Stats | null;
  tronc: Stats | null;
  /** Part (0–1) des mesures où l'app détecte bien la posture demandée. */
  reussite: number | null;
};

export function resumerEnregistrement(e: EnregistrementTest): ResumeEnregistrement {
  const posture = POSTURES_TEST.find((p) => p.id === e.posture)!;
  const mesurables = e.echantillons.filter((x) => x.mesurable);
  const reussies = mesurables.filter((x) =>
    posture.reussie(x.cou.niveau, x.tronc.niveau, x.tronc.sens),
  );
  return {
    mesures: e.echantillons.length,
    mesurables: mesurables.length,
    cou: stats(angles(e.echantillons, 'cou')),
    tronc: stats(angles(e.echantillons, 'tronc')),
    reussite: mesurables.length ? reussies.length / mesurables.length : null,
  };
}

export type ResumePosture = {
  posture: PostureTest;
  participants: number;
  /** Moyenne des moyennes de chaque participant : chacun pèse autant. */
  couMoyen: number | null;
  troncMoyen: number | null;
  /** Plus petite et plus grande valeur mesurée, tous participants confondus. */
  cou: Stats | null;
  tronc: Stats | null;
  reussite: number | null;
};

const moyenne = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);

export function resumerParPosture(essais: Essais): ResumePosture[] {
  return POSTURES_TEST.map(({ id }) => {
    const liste = essais.enregistrements.filter((e) => e.posture === id);
    const resumes = liste.map(resumerEnregistrement);
    return {
      posture: id,
      participants: liste.length,
      couMoyen: moyenne(resumes.flatMap((r) => (r.cou ? [r.cou.moyenne] : []))),
      troncMoyen: moyenne(resumes.flatMap((r) => (r.tronc ? [r.tronc.moyenne] : []))),
      cou: stats(liste.flatMap((e) => angles(e.echantillons, 'cou'))),
      tronc: stats(liste.flatMap((e) => angles(e.echantillons, 'tronc'))),
      reussite: moyenne(resumes.flatMap((r) => (r.reussite === null ? [] : [r.reussite]))),
    };
  });
}

/** Réussite globale : moyenne des réussites de tous les enregistrements. */
export function reussiteGlobale(essais: Essais): number | null {
  return moyenne(
    essais.enregistrements
      .map(resumerEnregistrement)
      .flatMap((r) => (r.reussite === null ? [] : [r.reussite])),
  );
}

// ---------------------------------------------------------------------------
// Export CSV (séparateur « ; » et virgule décimale : s'ouvre tel quel dans
// Excel ou LibreOffice en français)
// ---------------------------------------------------------------------------

const nombre = (v: number | null | undefined, decimales = 1) =>
  v === null || v === undefined || !isFinite(v) ? '' : v.toFixed(decimales).replace('.', ',');

const ligne = (cellules: (string | number)[]) => cellules.join(';');

const titrePosture = (id: PostureTest) => POSTURES_TEST.find((p) => p.id === id)!.titre;

/** Une ligne par mesure (environ 4 par seconde). */
export function csvMesures(essais: Essais): string {
  const lignes = [
    ligne([
      'participant',
      'posture',
      'temps_s',
      'mesurable',
      'cote',
      'cou_angle',
      'cou_niveau',
      'tronc_angle',
      'tronc_niveau',
      'tronc_sens',
      'score',
    ]),
  ];
  for (const e of essais.enregistrements) {
    for (const x of e.echantillons) {
      lignes.push(
        ligne([
          e.participant,
          titrePosture(e.posture),
          nombre(x.t / 1000, 2),
          x.mesurable ? 'oui' : 'non',
          x.cote ?? '',
          nombre(x.cou.angle),
          x.cou.niveau,
          nombre(x.tronc.angle),
          x.tronc.niveau,
          x.tronc.sens ?? '',
          nombre(x.score, 0),
        ]),
      );
    }
  }
  return lignes.join('\n') + '\n';
}

/** Une ligne par participant et par posture, puis la moyenne par posture. */
export function csvResume(essais: Essais): string {
  const entete = ligne([
    'participant',
    'posture',
    'attendu',
    'mesures_valides',
    'cou_moyen',
    'cou_min',
    'cou_max',
    'tronc_moyen',
    'tronc_min',
    'tronc_max',
    'reussite_pct',
  ]);
  const lignes = [entete];
  for (const e of essais.enregistrements) {
    const r = resumerEnregistrement(e);
    const p = POSTURES_TEST.find((x) => x.id === e.posture)!;
    lignes.push(
      ligne([
        e.participant,
        p.titre,
        p.attendu,
        r.mesurables,
        nombre(r.cou?.moyenne),
        nombre(r.cou?.min),
        nombre(r.cou?.max),
        nombre(r.tronc?.moyenne),
        nombre(r.tronc?.min),
        nombre(r.tronc?.max),
        nombre(r.reussite === null ? null : r.reussite * 100, 0),
      ]),
    );
  }
  for (const r of resumerParPosture(essais)) {
    if (!r.participants) continue;
    const p = POSTURES_TEST.find((x) => x.id === r.posture)!;
    lignes.push(
      ligne([
        `MOYENNE (${r.participants} pers.)`,
        p.titre,
        p.attendu,
        r.cou?.n ?? 0,
        nombre(r.couMoyen),
        nombre(r.cou?.min),
        nombre(r.cou?.max),
        nombre(r.troncMoyen),
        nombre(r.tronc?.min),
        nombre(r.tronc?.max),
        nombre(r.reussite === null ? null : r.reussite * 100, 0),
      ]),
    );
  }
  return lignes.join('\n') + '\n';
}

/*
 * Calcul des angles de posture et du code couleur, à partir des 17 points MoveNet.
 * Téléphone placé DE PROFIL (il filme le côté du corps).
 *
 * Utilisé à trois endroits :
 *   - la page de la WebView (src/page/pose.ts, compilée en public/pose.js) ;
 *   - l'app React Native, pour les types partagés (Niveau, SensTronc…) ;
 *   - les tests Node (scripts/posture.test.ts), sans compilation.
 * Aucun import : ce fichier doit rester utilisable partout tel quel.
 */

export type Niveau = 'vert' | 'orange' | 'rouge' | 'gris';
export type Cote = 'gauche' | 'droite';
/** Sens de l'inclinaison du buste ; null si inconnu. */
export type SensTronc = 'avant' | 'arriere' | null;

/** Point MoveNet : position en pixels de l'image, et confiance de 0 à 1. */
export type Point = { name?: string; x: number; y: number; score?: number };

type RegleCommune = { label: string; approximation: string };
export type RegleGrandEstMieux = RegleCommune & {
  sens: 'plusGrandEstMieux';
  vertAuDessusDe: number;
  orangeAuDessusDe: number;
  noteZeroEnDessousDe: number;
};
export type ReglePetitEstMieux = RegleCommune & {
  sens: 'plusPetitEstMieux';
  vertEnDessousDe: number;
  orangeEnDessousDe: number;
  noteZeroAuDessusDe: number;
};
export type Regle = RegleGrandEstMieux | ReglePetitEstMieux;

// ---------------------------------------------------------------------------
// SEUILS — un seul objet de configuration. Une ligne = une valeur + sa source.
// ---------------------------------------------------------------------------
export const CONFIG = {
  // Confiance minimale d'un point MoveNet pour être utilisé.
  // Valeur de départ usuelle des exemples TensorFlow.js pour MoveNet, à régler à l'usage.
  minKeypointScore: 0.3,

  // Lissage : moyenne mobile sur les N dernières positions de chaque point.
  // MoveNet tremble d'une image à l'autre ; 3 suffit à calmer sans ajouter de
  // retard visible. Mettre 1 pour désactiver complètement le lissage.
  lissageFenetre: 3,

  // Verrouillage du côté filmé : une fois choisi, on ne change de côté que si
  // l'autre est nettement mieux vu (confiance moyenne plus haute d'au moins
  // `coteMarge`) pendant `coteImagesPourChanger` images d'affilée. Le test du
  // 13/10/2026 a montré 54 mesures sur 1 378 (4 %) « basculées » un instant
  // sur le côté caché, avec des angles absurdes (cou à -9°, tronc à 40°).
  // Valeurs PROVISOIRES, choisies à la main.
  coteMarge: 0.1,
  coteImagesPourChanger: 10,

  cou: {
    label: 'Cou',
    // Angle craniovertébral APPROCHÉ : angle entre l'horizontale passant par
    // l'épaule et la droite épaule -> oreille. Plus grand = mieux.
    sens: 'plusGrandEstMieux',
    // Vert au-dessus de 50° : valeur la plus utilisée dans la littérature
    // sur l'angle craniovertébral (aucun seuil validé ; fourchette 44–55°
    // selon les auteurs), et confirmée par notre test du 13/10/2026
    // (3 participants, 1 378 mesures) : passer de 53° à 50° fait passer la
    // détection de la bonne posture de 84 % à 92 %, et la détection globale
    // de 92,9 % à 94,5 %, sans gêner celle de la tête en avant (91 -> 89 %).
    // Voir mobile/README.md, « Test des postures ».
    vertAuDessusDe: 50,
    // Rouge sous 45° : bas de la fourchette de la littérature ; dans le test,
    // 78 % des mesures « tête en avant » et aucune « bien droit » en dessous.
    orangeAuDessusDe: 45,
    // Note 0 à partir de cet angle (voir noteMesure). PROVISOIRE, choisi à la
    // main : 15° sous la borne orange.
    noteZeroEnDessousDe: 30,
    // APPROXIMATION ASSUMÉE : le vrai angle craniovertébral se mesure depuis C7.
    // MoveNet ne donne pas C7, on prend l'épaule à la place : les valeurs
    // absolues ne sont donc PAS comparables à celles de la littérature.
    approximation: 'epaule au lieu de C7',
  } satisfies RegleGrandEstMieux,

  tronc: {
    label: 'Tronc',
    // Angle de la droite épaule -> hanche par rapport à la verticale.
    // Plus petit = mieux (tronc droit).
    sens: 'plusPetitEstMieux',
    // Rouge au-delà de 20° : ISO 11226 (inclinaison du tronc acceptable
    // jusqu'à 20°) et palier de RULA. Vert sous 10° : choisi à la main.
    // Confirmés par le test du 13/10/2026 : 90 % des mesures « bien droit »
    // sous 7,9°, 90 % des « penché » et « avachi » au-dessus de 18,6°.
    vertEnDessousDe: 10,
    orangeEnDessousDe: 20,
    // Note 0 à partir de cet angle (voir noteMesure). PROVISOIRE, choisi à la
    // main : 20° au-dessus de la borne orange.
    noteZeroAuDessusDe: 40,
    approximation: 'epaule-hanche en 2D, sans correction de perspective',
  } satisfies ReglePetitEstMieux,
};

type NomsPoints = { oreille: string; epaule: string; hanche: string };

// Points MoveNet utilisés, par côté.
export const POINTS_PAR_COTE: Record<Cote, NomsPoints> = {
  gauche: { oreille: 'left_ear', epaule: 'left_shoulder', hanche: 'left_hip' },
  droite: { oreille: 'right_ear', epaule: 'right_shoulder', hanche: 'right_hip' },
};

export const COULEURS: Record<Niveau, string> = {
  vert: '#2ecc71',
  orange: '#f39c12',
  rouge: '#e74c3c',
  gris: '#9aa0a6',
};

const TEXTE_STATUT: Record<Niveau, string> = {
  vert: 'bonne position',
  orange: 'légèrement mauvaise',
  rouge: 'très mauvaise',
  gris: 'non mesurable',
};

// ---------------------------------------------------------------------------
// Outils
// ---------------------------------------------------------------------------

export type PointsParNom = Record<string, Point | undefined>;

/** Transforme la liste de points MoveNet en dictionnaire nom -> point. */
export function indexerPoints(keypoints: (Point | undefined)[] | null | undefined): PointsParNom {
  const parNom: PointsParNom = {};
  for (const kp of keypoints ?? []) {
    if (kp && kp.name) parNom[kp.name] = kp;
  }
  return parNom;
}

/** Un point est utilisable s'il existe et dépasse le seuil de confiance. */
export function pointFiable(kp: Point | null | undefined, seuil: number): kp is Point {
  return !!kp && typeof kp.x === 'number' && typeof kp.y === 'number' && (kp.score || 0) >= seuil;
}

/** Confiance moyenne d'un côté sur oreille + épaule + hanche (0 si points absents). */
export function confianceCote(parNom: PointsParNom, cote: Cote): number {
  const p = POINTS_PAR_COTE[cote];
  const cles = [p.oreille, p.epaule, p.hanche];
  let somme = 0;
  for (const cle of cles) {
    const kp = parNom[cle];
    somme += kp && typeof kp.score === 'number' ? kp.score : 0;
  }
  return somme / cles.length;
}

/**
 * Choisit le côté visible : meilleure confiance moyenne sur oreille + épaule + hanche.
 * Renvoie 'gauche' | 'droite' (et le score moyen retenu).
 */
export function choisirCote(parNom: PointsParNom): { cote: Cote; score: number } {
  let meilleur: { cote: Cote; score: number } = { cote: 'gauche', score: -1 };
  for (const cote of Object.keys(POINTS_PAR_COTE) as Cote[]) {
    const moyenne = confianceCote(parNom, cote);
    if (moyenne > meilleur.score) meilleur = { cote, score: moyenne };
  }
  return meilleur;
}

/**
 * Suiveur de côté : garde le même côté d'une image à l'autre, et n'en change
 * que si l'autre côté est nettement mieux vu pendant plusieurs images (voir
 * CONFIG.coteMarge et CONFIG.coteImagesPourChanger). Évite les bascules d'un
 * instant vers le côté caché.
 */
export function creerSuiveurCote(imagesPourChanger?: number, marge?: number) {
  const n = imagesPourChanger || CONFIG.coteImagesPourChanger;
  const m = marge === undefined ? CONFIG.coteMarge : marge;
  let actuel: Cote | null = null;
  let compte = 0;

  return {
    choisir(keypoints: (Point | undefined)[]): Cote {
      const parNom = indexerPoints(keypoints);
      const meilleur = choisirCote(parNom);
      if (!actuel) {
        actuel = meilleur.cote;
        return actuel;
      }
      const nettementMieux =
        meilleur.cote !== actuel && meilleur.score - confianceCote(parNom, actuel) >= m;
      compte = nettementMieux ? compte + 1 : 0;
      if (compte >= n) {
        actuel = meilleur.cote;
        compte = 0;
      }
      return actuel;
    },
    reinitialiser() {
      actuel = null;
      compte = 0;
    },
  };
}

type XY = { x: number; y: number };

/**
 * Angle, en degrés, entre l'horizontale passant par `epaule` et la droite
 * epaule -> oreille. 0° = oreille à la même hauteur que l'épaule (tête très
 * avancée), 90° = oreille pile au-dessus de l'épaule.
 * Les coordonnées image ont y vers le BAS, d'où le signe inversé sur dy.
 * On prend |dx| pour que le résultat ne dépende pas du côté filmé.
 */
export function angleCou(epaule: XY, oreille: XY): number {
  const dx = Math.abs(oreille.x - epaule.x);
  const dy = epaule.y - oreille.y; // > 0 si l'oreille est au-dessus de l'épaule
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/**
 * Angle, en degrés, entre la verticale et la droite epaule -> hanche.
 * 0° = tronc parfaitement vertical.
 */
export function angleTronc(epaule: XY, hanche: XY): number {
  const dx = Math.abs(hanche.x - epaule.x);
  const dy = Math.abs(hanche.y - epaule.y);
  return (Math.atan2(dx, dy) * 180) / Math.PI;
}

/**
 * Sens de l'inclinaison du buste : 'avant' (penché vers l'écran) ou
 * 'arriere' (avachi), null si on ne sait pas. L'angle du tronc, lui, reste
 * positif dans les deux cas : c'est ce sens qui les distingue.
 * La personne regarde du côté où le nez dépasse l'oreille ; le buste est
 * penché en avant si l'épaule est devant la hanche dans ce sens.
 * Ne dépend pas d'un éventuel effet miroir de la caméra.
 */
export function sensTronc(
  epaule: Point | undefined,
  hanche: Point | undefined,
  nez: Point | undefined,
  oreille: Point | undefined,
  seuil: number = CONFIG.minKeypointScore,
): SensTronc {
  if (
    !pointFiable(epaule, seuil) ||
    !pointFiable(hanche, seuil) ||
    !pointFiable(nez, seuil) ||
    !pointFiable(oreille, seuil)
  ) {
    return null;
  }
  const regard = Math.sign(nez.x - oreille.x);
  const avance = (epaule.x - hanche.x) * regard;
  if (!regard || !avance) return null;
  return avance > 0 ? 'avant' : 'arriere';
}

/**
 * Classe un angle en 'vert' | 'orange' | 'rouge', dans les deux sens.
 * `angle` à null/undefined/NaN -> 'gris' (non mesurable).
 *
 * Convention aux bornes (choisie, et testée dans scripts/posture.test.ts) :
 * la zone verte est STRICTE, donc une valeur pile sur une borne tombe en orange.
 *   cou   : 50 -> orange, 45 -> orange (vert seulement si > 50)
 *   tronc : 10 -> orange, 20 -> orange (vert seulement si < 10)
 */
export function classer(angle: number | null | undefined, regle: Regle): Niveau {
  if (angle === null || angle === undefined || !isFinite(angle)) return 'gris';
  if (regle.sens === 'plusGrandEstMieux') {
    if (angle > regle.vertAuDessusDe) return 'vert';
    if (angle >= regle.orangeAuDessusDe) return 'orange';
    return 'rouge';
  }
  if (angle < regle.vertEnDessousDe) return 'vert';
  if (angle <= regle.orangeEnDessousDe) return 'orange';
  return 'rouge';
}

/**
 * Note continue de 0 à 100 d'un angle, cohérente avec les couleurs :
 *   - zone verte                  -> 100
 *   - zone orange                 -> de 100 à 60, linéaire
 *   - zone rouge jusqu'au « zéro » -> de 60 à 0, linéaire
 * Exemples (cou) : 50° -> 100, 47,5° -> 80, 45° -> 60, 37,5° -> 30, 30° -> 0.
 * Un angle absent donne null : il ne compte pas dans le score.
 */
export function noteMesure(angle: number | null | undefined, regle: Regle): number | null {
  if (angle === null || angle === undefined || !isFinite(angle)) return null;
  if (regle.sens === 'plusGrandEstMieux') {
    const v = regle.vertAuDessusDe;
    const o = regle.orangeAuDessusDe;
    const z = regle.noteZeroEnDessousDe;
    if (angle >= v) return 100;
    if (angle >= o) return 60 + (40 * (angle - o)) / (v - o);
    if (angle <= z) return 0;
    return (60 * (angle - z)) / (o - z);
  }
  const v = regle.vertEnDessousDe;
  const o = regle.orangeEnDessousDe;
  const z = regle.noteZeroAuDessusDe;
  if (angle <= v) return 100;
  if (angle <= o) return 100 - (40 * (angle - v)) / (o - v);
  if (angle >= z) return 0;
  return (60 * (z - angle)) / (z - o);
}

/** Score 0–100 d'une pose : moyenne des notes du cou et du tronc mesurés. */
export function scorePosture(
  angleC: number | null | undefined,
  angleT: number | null | undefined,
): number | null {
  const notes = [noteMesure(angleC, CONFIG.cou), noteMesure(angleT, CONFIG.tronc)].filter(
    (n): n is number => n !== null,
  );
  if (!notes.length) return null;
  return notes.reduce((a, b) => a + b, 0) / notes.length;
}

export type MesureAngle = {
  label: string;
  angle: number | null;
  niveau: Niveau;
  couleur: string;
  texte: string;
};

export type Analyse = {
  cote: Cote;
  confianceCote: number;
  /** Score 0–100, null si rien n'est mesurable. */
  score: number | null;
  cou: MesureAngle;
  tronc: MesureAngle & { sens: SensTronc };
};

/**
 * Analyse une pose MoveNet complète.
 * Renvoie toujours un objet de même forme, avec niveau 'gris' si non mesurable.
 */
export function analyser(
  keypoints: (Point | undefined)[] | null | undefined,
  options?: { minKeypointScore?: number; cote?: Cote },
): Analyse {
  const seuil = options?.minKeypointScore || CONFIG.minKeypointScore;
  const parNom = indexerPoints(keypoints);
  // Côté imposé (suiveur de côté) ou, à défaut, le mieux vu sur cette image.
  const cote = options?.cote || choisirCote(parNom).cote;
  const noms = POINTS_PAR_COTE[cote];

  const epaule = parNom[noms.epaule];
  const oreille = parNom[noms.oreille];
  const hanche = parNom[noms.hanche];

  const epauleOk = pointFiable(epaule, seuil);

  const angleC = epauleOk && pointFiable(oreille, seuil) ? angleCou(epaule, oreille) : null;
  const angleT = epauleOk && pointFiable(hanche, seuil) ? angleTronc(epaule, hanche) : null;

  const niveauC = classer(angleC, CONFIG.cou);
  const niveauT = classer(angleT, CONFIG.tronc);
  const sensT = angleT === null ? null : sensTronc(epaule, hanche, parNom.nose, oreille, seuil);

  return {
    cote,
    confianceCote: confianceCote(parNom, cote),
    score: scorePosture(angleC, angleT),
    cou: {
      label: CONFIG.cou.label,
      angle: angleC,
      niveau: niveauC,
      couleur: COULEURS[niveauC],
      texte: phrase(CONFIG.cou.label, angleC, niveauC),
    },
    tronc: {
      label: CONFIG.tronc.label,
      angle: angleT,
      niveau: niveauT,
      couleur: COULEURS[niveauT],
      texte: phrase(CONFIG.tronc.label, angleT, niveauT),
      sens: sensT,
    },
  };
}

/** Statut en texte : la couleur ne doit jamais être le seul signal. */
function phrase(label: string, angle: number | null, niveau: Niveau): string {
  if (niveau === 'gris' || angle === null) {
    return label + ' : non mesurable (point absent ou peu fiable)';
  }
  return label + ' : ' + angle.toFixed(0) + '° — ' + TEXTE_STATUT[niveau];
}

/**
 * Couleur d'un point individuel : grise si peu fiable, sinon la couleur du
 * segment auquel il appartient (cou ou tronc), sinon neutre.
 */
export function couleurPoint(
  kp: Point | undefined,
  analyse: Analyse,
  noms: NomsPoints,
  seuil: number,
): string {
  if (!pointFiable(kp, seuil)) return COULEURS.gris;
  if (!kp.name) return '#ffffff';
  if (kp.name === noms.oreille) return analyse.cou.couleur;
  if (kp.name === noms.hanche) return analyse.tronc.couleur;
  if (kp.name === noms.epaule) {
    // L'épaule sert aux deux mesures : on montre la pire des deux.
    return pireCouleur(analyse.cou.niveau, analyse.tronc.niveau);
  }
  return '#ffffff';
}

const ORDRE_GRAVITE: Record<Niveau, number> = { vert: 0, orange: 1, rouge: 2, gris: -1 };

function pireCouleur(a: Niveau, b: Niveau): string {
  const na = ORDRE_GRAVITE[a];
  const nb = ORDRE_GRAVITE[b];
  if (na < 0 && nb < 0) return COULEURS.gris;
  return COULEURS[na >= nb ? a : b];
}

/**
 * Lisseur : moyenne mobile sur les `fenetre` dernières positions de chaque
 * point, pour calmer le tremblement de MoveNet d'une image à l'autre.
 *
 * Un point qui repasse sous le seuil de confiance voit son historique remis à
 * zéro : sans ça, le point resterait collé à sa dernière position connue
 * pendant quelques images après avoir disparu.
 */
export function creerLisseur(fenetre?: number, seuil?: number) {
  const taille = fenetre || CONFIG.lissageFenetre;
  const seuilMin = seuil === undefined ? CONFIG.minKeypointScore : seuil;
  let historique: Record<string, XY[]> = {};

  return {
    lisser(keypoints: Point[] | null | undefined): Point[] {
      if (taille <= 1 || !keypoints) return keypoints || [];
      return keypoints.map((kp) => {
        const nom = kp?.name;
        if (!kp || !nom) return kp;
        if (!pointFiable(kp, seuilMin)) {
          delete historique[nom];
          return kp;
        }
        const h = historique[nom] || (historique[nom] = []);
        h.push({ x: kp.x, y: kp.y });
        if (h.length > taille) h.shift();
        let sx = 0;
        let sy = 0;
        for (const p of h) {
          sx += p.x;
          sy += p.y;
        }
        // On garde le score de l'image courante : seule la position est lissée.
        return { name: nom, score: kp.score, x: sx / h.length, y: sy / h.length };
      });
    },
    reinitialiser() {
      historique = {};
    },
  };
}

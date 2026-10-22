/*
 * Affichage d'une capture du serveur : noms des points et traits du squelette.
 *
 * Fichier sans dépendance React Native : testé par tests/session.test.ts.
 */
import type { Keypoint } from './types/sessions.types';

export const NOMBRE_POINTS = 17;

const LIBELLES: Record<string, string> = {
  nose: 'nez',
  left_eye: 'œil gauche',
  right_eye: 'œil droit',
  left_ear: 'oreille gauche',
  right_ear: 'oreille droite',
  left_shoulder: 'épaule gauche',
  right_shoulder: 'épaule droite',
  left_elbow: 'coude gauche',
  right_elbow: 'coude droit',
  left_wrist: 'poignet gauche',
  right_wrist: 'poignet droit',
  left_hip: 'hanche gauche',
  right_hip: 'hanche droite',
  left_knee: 'genou gauche',
  right_knee: 'genou droit',
  left_ankle: 'cheville gauche',
  right_ankle: 'cheville droite',
};

/**
 * Traits du squelette du site (format COCO), plus oreille – épaule : c'est la
 * ligne de l'angle du cou, et l'app n'envoie que l'oreille, l'épaule et la hanche.
 */
export const SEGMENTS: [string, string][] = [
  ['left_ear', 'left_eye'],
  ['left_eye', 'nose'],
  ['nose', 'right_eye'],
  ['right_eye', 'right_ear'],
  ['left_ear', 'left_shoulder'],
  ['right_ear', 'right_shoulder'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

/** Traits dont les deux extrémités ont été envoyées. */
export function segmentsVisibles(keypoints: Keypoint[]): [Keypoint, Keypoint][] {
  const parNom = new Map(keypoints.map((k) => [k.bodyPart, k]));
  return SEGMENTS.flatMap(([a, b]) => {
    const p = parNom.get(a);
    const q = parNom.get(b);
    return p && q ? [[p, q] as [Keypoint, Keypoint]] : [];
  });
}

type XY = { x: number; y: number };

/**
 * Oreille, épaule et hanche du côté filmé, et le sens du regard dans l'image :
 * 1 si la personne regarde vers les x croissants, -1 sinon. Côté droit filmé,
 * elle regarde vers la droite de l'image (caméra frontale, image non inversée),
 * ce que confirment les captures du 22/10 : l'oreille y est devant l'épaule.
 * null s'il manque un des 3 points.
 */
export function lirePose(
  keypoints: Keypoint[],
): { oreille: XY; epaule: XY; hanche: XY; sens: 1 | -1 } | null {
  const parNom = new Map(keypoints.map((k) => [k.bodyPart, k]));
  for (const [cote, sens] of [['right', 1], ['left', -1]] as const) {
    const oreille = parNom.get(`${cote}_ear`);
    const epaule = parNom.get(`${cote}_shoulder`);
    const hanche = parNom.get(`${cote}_hip`);
    if (oreille && epaule && hanche) return { oreille, epaule, hanche, sens };
  }
  return null;
}

/** Repère de la mascotte (viewBox) : 320 × 300, hanche fixe, regard vers la droite. */
export const MASCOTTE = { largeur: 320, hauteur: 300, hanche: { x: 150, y: 196 } };
const TRONC = 92;
const COU = 34;

/**
 * Silhouette de la mascotte assise. Le tronc (`troncDegres` : 0 = droit,
 * positif = penché en avant, négatif = avachi) et le cou (`couDegres` : 90 =
 * oreille au-dessus de l'épaule, moins = tête en avant) viennent de la mesure ;
 * jambes et bras ne donnent que la forme, à une place fixe.
 */
export function silhouette(troncDegres: number, couDegres: number) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const t = rad(Math.max(-60, Math.min(60, troncDegres)));
  const c = rad(Math.max(0, Math.min(150, couDegres)));
  const hanche = MASCOTTE.hanche;
  const epaule = { x: hanche.x + TRONC * Math.sin(t), y: hanche.y - TRONC * Math.cos(t) };
  const oreille = { x: epaule.x + COU * Math.cos(c), y: epaule.y - COU * Math.sin(c) };
  const genou = { x: hanche.x + 78, y: hanche.y + 4 };
  const cheville = { x: genou.x + 4, y: 270 };
  const coude = { x: epaule.x + 14, y: epaule.y + 50 };
  return {
    hanche,
    epaule,
    oreille,
    genou,
    cheville,
    pied: { x: cheville.x + 20, y: 270 },
    coude,
    poignet: { x: coude.x + 44, y: coude.y - 4 },
  };
}

/** « 3 points : oreille droite, épaule droite, hanche droite ». */
export function phrasePoints(keypoints: Keypoint[]): string {
  if (!keypoints.length) return 'Aucun point détecté';
  const noms = keypoints.map((k) => LIBELLES[k.bodyPart] ?? k.bodyPart).join(', ');
  return `${keypoints.length} point${keypoints.length > 1 ? 's' : ''} : ${noms}`;
}

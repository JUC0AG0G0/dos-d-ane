import type { PointCorps } from './messages';
import type { Point } from './posture';

/** Format de capture (largeur / hauteur), le même que la boîte #scene de pose.html. */
export const RATIO_CAPTURE = 3 / 4;

export type Cadrage = { x: number; y: number; largeur: number; hauteur: number };

/**
 * Zone au format `ratio`, centrée dans une vidéo de taille quelconque. La vidéo
 * de pose.html est en `object-fit: cover`, qui rogne la même zone : ce qui est
 * affiché est exactement ce qui est analysé.
 */
export function cadrer(largeurVideo: number, hauteurVideo: number, ratio = RATIO_CAPTURE): Cadrage {
  if (largeurVideo / hauteurVideo > ratio) {
    const largeur = Math.round(hauteurVideo * ratio);
    return { x: (largeurVideo - largeur) / 2, y: 0, largeur, hauteur: hauteurVideo };
  }
  const hauteur = Math.round(largeurVideo / ratio);
  return { x: 0, y: (hauteurVideo - hauteur) / 2, largeur: largeurVideo, hauteur };
}

/**
 * Points fiables (confiance >= `seuil`), arrondis au pixel et ramenés dans
 * l'image : le serveur refuse toute la capture si un seul point en sort, et
 * MoveNet place parfois un point caché un peu au-delà du bord.
 */
export function pointsDansImage(
  keypoints: Point[],
  image: { largeur: number; hauteur: number },
  seuil: number,
): PointCorps[] {
  const borner = (valeur: number, max: number) => Math.min(max, Math.max(0, Math.round(valeur)));
  return keypoints.flatMap((kp) =>
    kp.name && (kp.score ?? 0) >= seuil
      ? [
          {
            nom: kp.name,
            x: borner(kp.x, image.largeur),
            y: borner(kp.y, image.hauteur),
            confiance: kp.score ?? 0,
          },
        ]
      : [],
  );
}

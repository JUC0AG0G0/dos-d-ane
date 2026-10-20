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

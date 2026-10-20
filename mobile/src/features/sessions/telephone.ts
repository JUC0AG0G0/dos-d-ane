/*
 * Inclinaison et mouvement du téléphone, d'après la gravité mesurée par
 * l'accéléromètre (en g). L'inclinaison sert à redresser les points avant la
 * mesure ; un téléphone qui bouge ou trop penché rend la mesure non fiable.
 *
 * Fichier sans dépendance React Native : testé par tests/telephone.test.ts.
 */
import type { EtatTelephone } from '@/features/analysis';

export const SEUILS_TELEPHONE = {
  // Au-delà, la correction ne suffit plus (perspective) : on demande de redresser.
  // Choisi à la main.
  inclinaisonMaxDegres: 25,
  // Variation d'inclinaison entre deux lectures (10 par seconde) au-delà de
  // laquelle le téléphone bouge : 1,5° en 0,1 s = 15°/s. Choisi à la main.
  variationMaxDegres: 1.5,
  // Écart de la norme de l'accélération à 1 g (secousse, déplacement). Choisi à la main.
  ecartGraviteMax: 0.08,
  // Le téléphone redevient stable après ce délai sans mouvement.
  calmeMs: 1000,
  // Sous cette part de la gravité dans le plan de l'écran, le téléphone est à
  // plat : son inclinaison n'a plus de sens.
  gravitePlanMin: 0.5,
};

export type Gravite = { x: number; y: number; z: number };

/**
 * Inclinaison du téléphone tenu droit, en degrés, dans le plan de l'écran :
 * positive quand le haut penche vers la droite (vu de face). Ramenée entre
 * -90° et 90° : le résultat est le même que l'axe y vaille -1 g (iOS) ou +1 g
 * (Android) téléphone droit.
 */
export function inclinaison({ x, y }: Gravite): number {
  const degres = (Math.atan2(x, -y) * 180) / Math.PI;
  if (degres > 90) return degres - 180;
  if (degres < -90) return degres + 180;
  return degres;
}

/** Suit les lectures successives de l'accéléromètre et en déduit l'état du téléphone. */
export function creerSuiviTelephone(seuils = SEUILS_TELEPHONE) {
  let precedente: number | null = null;
  let dernierMouvement = -Infinity;

  return {
    mesurer(g: Gravite, instantMs: number): { inclinaison: number; etat: EtatTelephone } {
      const angle = inclinaison(g);
      const norme = Math.hypot(g.x, g.y, g.z);
      const bouge =
        Math.abs(norme - 1) > seuils.ecartGraviteMax ||
        (precedente !== null && Math.abs(angle - precedente) > seuils.variationMaxDegres);
      precedente = angle;
      if (bouge) dernierMouvement = instantMs;

      let etat: EtatTelephone = 'stable';
      if (Math.hypot(g.x, g.y) < seuils.gravitePlanMin) etat = 'penche';
      else if (instantMs - dernierMouvement < seuils.calmeMs) etat = 'mouvement';
      else if (Math.abs(angle) > seuils.inclinaisonMaxDegres) etat = 'penche';
      return { inclinaison: angle, etat };
    },
  };
}

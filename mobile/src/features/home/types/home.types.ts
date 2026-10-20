export type DonneesAccueil = {
  nomAffiche: string;
  /** Part du temps en bonne posture aujourd'hui, de 0 à 100 ; null si aucune session. */
  bonneDuJour: number | null;
  /** Écart en points de % avec la veille ; null si pas de session la veille. */
  ecartVeille: number | null;
  conseilDuJour: string;
};

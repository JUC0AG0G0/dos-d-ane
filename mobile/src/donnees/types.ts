/** Formes des données affichées par l'app, indépendantes de leur provenance. */

export type DonneesAccueil = {
  /** Nom affiché du compte (displayName côté serveur). */
  nomAffiche: string;
  /** Score moyen de la journée, de 0 à 100 ; null si aucune session aujourd'hui. */
  scoreDuJour: number | null;
  /** Écart en points avec la veille ; null si pas de score la veille. */
  ecartVeille: number | null;
  conseilDuJour: string;
};

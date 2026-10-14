/**
 * Point d'entrée unique des données. Les écrans n'appellent que ces fonctions :
 * passer de l'historique local au serveur ne changera que ce fichier.
 */
import { utilisateurActuel } from '@/auth/session';

import { genererDemo } from './demo';
import { conseilDuJour, exercicesRecommandes, resumeSituation, type Filtre } from './exercices';
import { resumer, situation, type Periode } from './statistiques';
import { chargerHistorique, effacerHistorique, remplacerHistorique } from './stockage';
import type { DonneesAccueil } from './types';

export type { DonneesAccueil } from './types';

export async function chargerAccueil(): Promise<DonneesAccueil> {
  const historique = await chargerHistorique();
  const maintenant = new Date();
  const jour = resumer(historique.tranches, 'jour', maintenant);
  return {
    // Nom du compte connecté (rafraîchi par GET /api/auth/me au lancement).
    nomAffiche: utilisateurActuel()?.displayName ?? '',
    scoreDuJour: jour.score,
    ecartVeille: jour.ecart,
    conseilDuJour: conseilDuJour(situation(historique, maintenant)),
  };
}

export async function chargerResultats(periode: Periode, ref: Date) {
  const historique = await chargerHistorique();
  return resumer(historique.tranches, periode, ref);
}

export async function chargerConseils(filtre: Filtre) {
  const historique = await chargerHistorique();
  const s = situation(historique, new Date());
  return { resume: resumeSituation(s), exercices: exercicesRecommandes(s, filtre) };
}

export async function remplirAvecDemo(): Promise<void> {
  await remplacerHistorique(genererDemo(new Date()));
}

export { effacerHistorique };

/** Appréciation d'un score, alignée sur la répartition Bonne / Moyenne / À améliorer. */
export function appreciationScore(score: number): string {
  if (score >= 75) return 'Bonne posture';
  if (score >= 50) return 'Posture moyenne';
  return 'Posture à améliorer';
}

/** « +6 pts vs hier », « −3 pts vs hier », « = hier ». */
export function texteEcart(ecart: number, reference: string): string {
  if (ecart === 0) return `= ${reference}`;
  const signe = ecart > 0 ? '+' : '−';
  return `${signe}${Math.abs(ecart)} pts vs ${reference}`;
}

/**
 * Données de l'historique pour les écrans. Les écrans n'appellent que ces
 * fonctions : passer de l'historique local au serveur ne changera que ce fichier.
 */
import { resumer, type Periode } from '../statistiques';
import { chargerHistorique } from './stockage';

export async function chargerResultats(periode: Periode, ref: Date) {
  const historique = await chargerHistorique();
  return resumer(historique.tranches, periode, ref);
}

import { conseilDuJour } from '@/features/advice';
import { chargerHistorique, resumer, situation } from '@/features/history';
import { utilisateurActuel } from '@/store/auth.store';

import type { DonneesAccueil } from '../types/home.types';

export async function chargerAccueil(): Promise<DonneesAccueil> {
  const historique = await chargerHistorique();
  const maintenant = new Date();
  const jour = resumer(historique.tranches, 'jour', maintenant);
  return {
    nomAffiche: utilisateurActuel()?.displayName ?? '',
    bonneDuJour: jour.bonne,
    ecartVeille: jour.ecart,
    conseilDuJour: conseilDuJour(situation(historique, maintenant)),
  };
}

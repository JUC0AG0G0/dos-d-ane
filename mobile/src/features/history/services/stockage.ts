/**
 * Historique des sessions, gardé sur le téléphone (AsyncStorage) : pas encore
 * envoyé au serveur. Uniquement des chiffres : angles moyens, durées par couleur.
 * Jamais d'image.
 *
 * Un historique PAR COMPTE : chaque utilisateur connecté sur ce téléphone ne
 * voit que ses propres données.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { utilisateurActuel } from '@/store/auth.store';

import {
  fusionnerTranches,
  type Historique,
  type SessionEnregistree,
  type Tranche,
} from '../statistiques';

// Avant les comptes, un seul historique pour le téléphone : il est rattaché au
// premier compte qui se connecte (le propriétaire du téléphone).
const CLE_SANS_COMPTE = 'dosdane.historique.v1';

function cleUtilisateur(): string {
  const utilisateur = utilisateurActuel();
  if (!utilisateur) throw new Error('Aucun utilisateur connecté.');
  return `dosdane.historique.v2.${utilisateur.id}`;
}
/** Au-delà, les tranches les plus anciennes sont supprimées (minimisation). */
const CONSERVATION_JOURS = 400;
const SESSIONS_GARDEES = 300;

const vide = (): Historique => ({ tranches: [], sessions: [] });

async function lire(cle: string): Promise<Historique> {
  try {
    let brut = await AsyncStorage.getItem(cle);
    if (!brut) {
      brut = await AsyncStorage.getItem(CLE_SANS_COMPTE);
      if (brut) {
        await AsyncStorage.setItem(cle, brut);
        await AsyncStorage.removeItem(CLE_SANS_COMPTE);
      }
    }
    if (!brut) return vide();
    const lu = JSON.parse(brut) as Partial<Historique>;
    return { tranches: lu.tranches ?? [], sessions: lu.sessions ?? [] };
  } catch {
    return vide();
  }
}

export function chargerHistorique(): Promise<Historique> {
  return lire(cleUtilisateur());
}

// Les écritures passent l'une après l'autre : deux sauvegardes rapprochées
// (sauvegarde périodique puis fin de session) ne s'écrasent pas.
let file: Promise<void> = Promise.resolve();

function modifier(transformer: (h: Historique) => Historique): Promise<void> {
  // Clé lue tout de suite : une écriture en attente reste chez son utilisateur
  // même si quelqu'un d'autre se connecte entre-temps. Sans utilisateur
  // (session expirée pendant une mesure), l'écriture échoue sans planter.
  let cle: string;
  try {
    cle = cleUtilisateur();
  } catch (erreur) {
    return Promise.reject(erreur);
  }
  file = file.then(async () => {
    const nouveau = transformer(await lire(cle));
    const limite = Date.now() - CONSERVATION_JOURS * 24 * 3600 * 1000;
    nouveau.tranches = nouveau.tranches.filter((t) => t.debut >= limite);
    nouveau.sessions = nouveau.sessions.slice(-SESSIONS_GARDEES);
    await AsyncStorage.setItem(cle, JSON.stringify(nouveau));
  });
  return file;
}

/** Ajoute des mesures (même heure : additionnées) et, en fin de session, la session. */
export function enregistrer(tranches: Tranche[], session?: SessionEnregistree): Promise<void> {
  return modifier((h) => ({
    tranches: fusionnerTranches(h.tranches, tranches),
    sessions: session ? [...h.sessions, session] : h.sessions,
  }));
}

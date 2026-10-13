/**
 * Historique des sessions, gardé sur le téléphone (AsyncStorage) en attendant
 * les routes de sessions du serveur. Uniquement des chiffres : scores, angles
 * moyens, durées. Jamais d'image.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  fusionnerTranches,
  type Historique,
  type SessionEnregistree,
  type Tranche,
} from './statistiques';

const CLE = 'dosdane.historique.v1';
/** Au-delà, les tranches les plus anciennes sont supprimées (minimisation). */
const CONSERVATION_JOURS = 400;
const SESSIONS_GARDEES = 300;

const vide = (): Historique => ({ tranches: [], sessions: [] });

export async function chargerHistorique(): Promise<Historique> {
  try {
    const brut = await AsyncStorage.getItem(CLE);
    if (!brut) return vide();
    const lu = JSON.parse(brut) as Partial<Historique>;
    return { tranches: lu.tranches ?? [], sessions: lu.sessions ?? [] };
  } catch {
    return vide();
  }
}

// Les écritures passent l'une après l'autre : deux sauvegardes rapprochées
// (sauvegarde périodique puis fin de session) ne s'écrasent pas.
let file: Promise<void> = Promise.resolve();

function modifier(transformer: (h: Historique) => Historique): Promise<void> {
  file = file.then(async () => {
    const nouveau = transformer(await chargerHistorique());
    const limite = Date.now() - CONSERVATION_JOURS * 24 * 3600 * 1000;
    nouveau.tranches = nouveau.tranches.filter((t) => t.debut >= limite);
    nouveau.sessions = nouveau.sessions.slice(-SESSIONS_GARDEES);
    await AsyncStorage.setItem(CLE, JSON.stringify(nouveau));
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

export function remplacerHistorique(historique: Historique): Promise<void> {
  return modifier(() => historique);
}

export function effacerHistorique(): Promise<void> {
  return modifier(vide);
}

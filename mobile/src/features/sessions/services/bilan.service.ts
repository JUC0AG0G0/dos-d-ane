import {
  adviceService,
  conseilDuJour,
  exercicesRecommandes,
  problemePrincipal,
} from '@/features/advice';
import { chargerHistorique, situationSession } from '@/features/history';

import { sessionsService } from './sessions.service';

/** Exercices conseillés en fin de session. */
const EXERCICES_BILAN = 2;

/** Sessions terminées sur ce téléphone, de la plus récente à la plus ancienne. */
export async function chargerSessions() {
  const historique = await chargerHistorique();
  return [...historique.sessions].reverse().map((session) => ({
    session,
    probleme: problemePrincipal(situationSession(session)),
  }));
}

/**
 * Bilan d'une session terminée, retrouvée par son début. Les captures et les
 * exercices viennent du serveur : s'il est injoignable, le bilan s'affiche
 * sans eux.
 */
export async function chargerBilan(debut: number) {
  const historique = await chargerHistorique();
  const session = historique.sessions.find((s) => s.debut === debut);
  if (!session) throw new Error('session introuvable sur ce téléphone');
  const [serveur, exercices] = await Promise.all([
    session.serveur ? sessionsService.get(session.serveur).catch(() => null) : null,
    adviceService
      .exercises()
      .then((liste) => liste.items)
      .catch(() => []),
  ]);
  const situation = situationSession(session);
  return {
    session,
    captures: serveur?.captureCount ?? null,
    situation,
    probleme: problemePrincipal(situation),
    conseil: conseilDuJour(situation),
    exercices: exercicesRecommandes(exercices, situation).slice(0, EXERCICES_BILAN),
  };
}

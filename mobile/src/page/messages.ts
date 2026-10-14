/*
 * Messages envoyés par la page d'analyse (src/page/pose.ts, dans la WebView)
 * à l'app React Native (src/composants/CameraAnalyse.tsx). Un seul endroit pour
 * leur forme : la page et l'app ne peuvent plus diverger.
 */
import type { Cote, Niveau, SensTronc } from './posture';

/** Mesure du moment, environ 4 fois par seconde. */
export type MessageMesure =
  | { type: 'mesure'; personne: false }
  | {
      type: 'mesure';
      personne: true;
      cote: Cote;
      /** Score 0–100, entier, calculé à partir des angles (posture.ts, scorePosture). */
      score: number | null;
      cou: { angle: number | null; niveau: Niveau };
      /** sens : avant (penché vers l'écran), arriere (avachi), null si inconnu. */
      tronc: { angle: number | null; niveau: Niveau; sens?: SensTronc };
    };

/** État ou erreur de la page (diagnostic). */
export type MessageEtat = { type: 'etat' | 'erreur' | 'pret'; message: string };

export type MessagePage = MessageMesure | MessageEtat;

const TYPES_CONNUS = new Set<string>(['mesure', 'etat', 'erreur', 'pret']);

/** Message reçu de la page ; null si le texte n'est pas un message connu. */
export function lireMessagePage(texte: string): MessagePage | null {
  let objet: unknown;
  try {
    objet = JSON.parse(texte);
  } catch {
    return null;
  }
  const type = (objet as { type?: unknown } | null)?.type;
  return typeof type === 'string' && TYPES_CONNUS.has(type) ? (objet as MessagePage) : null;
}

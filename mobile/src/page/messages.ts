/*
 * Messages envoyés par la page d'analyse (src/page/pose.ts, dans la WebView)
 * à l'app React Native (src/camera/mesure.ts). Un seul endroit pour leur
 * forme : la page et l'app ne peuvent plus diverger.
 */
import type { Cote, Niveau, SensTronc } from './posture';

/** Mesure du moment, environ 4 fois par seconde. */
export type MessageMesure =
  | { type: 'mesure'; personne: false }
  | {
      type: 'mesure';
      personne: true;
      cote: Cote;
      /** Score 0–100 calculé à partir des angles (posture.ts, scorePosture). */
      score: number | null;
      cou: { angle: number | null; niveau: Niveau };
      /** sens : avant (penché vers l'écran), arriere (avachi), null si inconnu. */
      tronc: { angle: number | null; niveau: Niveau; sens?: SensTronc };
    };

/** État ou erreur de la page (diagnostic). */
export type MessageEtat = { type: 'etat' | 'erreur' | 'pret'; message: string };

export type MessagePage = MessageMesure | MessageEtat;

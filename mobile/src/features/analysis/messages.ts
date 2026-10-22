/*
 * Messages envoyés par la page d'analyse (pose.ts, dans la WebView) à l'app
 * React Native (sessions/components/CameraAnalyse.tsx). Un seul endroit pour
 * leur forme : la page et l'app ne peuvent plus diverger.
 */
import type { Cote, Niveau, SensTronc } from './posture';

/**
 * État du téléphone, lu par l'app sur l'accéléromètre : `inconnu` sans capteur
 * (page ouverte dans Safari, par exemple).
 */
export type EtatTelephone = 'stable' | 'mouvement' | 'penche' | 'inconnu';

/** Point du corps en pixels entiers de l'image analysée, nommé comme MoveNet (`left_ear`…). */
export type PointCorps = { nom: string; x: number; y: number; confiance: number };

/**
 * Mesure du moment, environ 4 fois par seconde. `inclinaison` : degrés dont
 * penche le téléphone, déjà corrigés dans les angles. `image` et `points` :
 * taille de l'image analysée et les 3 points mesurés (oreille, épaule, hanche
 * du côté filmé) s'ils sont fiables, non redressés, pour le serveur.
 */
export type MessageMesure =
  | { type: 'mesure'; personne: false; telephone: EtatTelephone }
  | {
      type: 'mesure';
      personne: true;
      telephone: EtatTelephone;
      inclinaison: number;
      cote: Cote;
      cou: { angle: number | null; niveau: Niveau };
      /** sens : avant (penché vers l'écran), arriere (avachi), null si inconnu. */
      tronc: { angle: number | null; niveau: Niveau; sens?: SensTronc };
      image?: { largeur: number; hauteur: number };
      points?: PointCorps[];
    };

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

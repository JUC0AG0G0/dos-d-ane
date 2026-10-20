import type { MessageMesure, Niveau } from '@/features/analysis';

export type Mesure = MessageMesure;

export type MessagePosture = {
  titre: string;
  conseil: string;
  alerte: boolean;
  /** Pire niveau du cou et du tronc ; null tant qu'aucune posture n'est mesurée. */
  niveau: Niveau | null;
};

const GRAVITE: Record<Niveau, number> = { gris: -1, vert: 0, orange: 1, rouge: 2 };

const VERDICT: Record<'orange' | 'rouge', string> = {
  orange: 'Changez légèrement de position',
  rouge: 'Veuillez vous asseoir correctement',
};

/**
 * Message de la carte de statut de l'écran « Session en cours ». Le titre suit
 * le pire niveau des deux angles (vert, orange, rouge) ; le conseil nomme
 * l'angle en cause, le cou d'abord à niveau égal.
 */
export function messagePosture(mesure: Mesure | null): MessagePosture {
  const etat = (titre: string, conseil: string): MessagePosture => ({
    titre,
    conseil,
    alerte: false,
    niveau: null,
  });
  if (!mesure) return etat('Démarrage de la caméra…', 'Autorisez l’accès à la caméra');
  if (mesure.telephone === 'mouvement') {
    return etat('Téléphone en mouvement', 'Reposez-le : la mesure reprend dans un instant');
  }
  if (mesure.telephone === 'penche') {
    return etat('Téléphone trop penché', 'Posez-le bien droit, de profil');
  }
  if (!mesure.personne) {
    return etat('Aucune personne détectée', 'Placez-vous de profil, face à l’écran du téléphone');
  }
  const { cou, tronc } = mesure;
  const pire = GRAVITE[cou.niveau] >= GRAVITE[tronc.niveau] ? cou.niveau : tronc.niveau;
  if (pire === 'gris') {
    return etat('Position non mesurable', 'Oreille, épaule et hanche doivent être visibles');
  }
  if (pire === 'vert') {
    return { titre: 'Bonne posture', conseil: 'Continuez comme ça', alerte: false, niveau: 'vert' };
  }

  let conseil: string;
  if (cou.niveau === pire) {
    conseil =
      (cou.angle ?? 0) > 90
        ? 'Tête en arrière : ramenez-la au-dessus des épaules'
        : 'Tête en avant : rentrez légèrement le menton';
  } else {
    conseil =
      tronc.sens === 'arriere'
        ? 'Dos avachi : asseyez-vous au fond de la chaise'
        : 'Buste penché : redressez-vous, rapprochez plutôt l’écran';
  }
  return { titre: VERDICT[pire], conseil, alerte: true, niveau: pire };
}

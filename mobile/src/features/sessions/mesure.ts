import type { MessageMesure, Niveau } from '@/features/analysis';

import type { CaptureInput } from './types/sessions.types';

export type Mesure = MessageMesure;

/**
 * Capture à envoyer au serveur, ou null si la mesure ne doit pas partir :
 * personne absente, téléphone qui bouge ou trop penché (mêmes règles que
 * l'historique local), ou aucun point fiable.
 */
export function versCapture(mesure: Mesure, instant: number): CaptureInput | null {
  if (!mesure.personne || !mesure.image || !mesure.points?.length) return null;
  if (mesure.telephone === 'mouvement' || mesure.telephone === 'penche') return null;
  return {
    capturedAt: new Date(instant).toISOString(),
    imageWidth: mesure.image.largeur,
    imageHeight: mesure.image.hauteur,
    keypoints: mesure.points.map((p) => ({
      bodyPart: p.nom,
      x: p.x,
      y: p.y,
      confidence: p.confiance,
    })),
  };
}

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

/** Ce qui rend la posture mauvaise : le conseil de l'écran et de la notification en dépend. */
export type Cause = 'teteAvant' | 'teteArriere' | 'bustePenche' | 'avachi';

export const CONSEILS: Record<Cause, string> = {
  teteAvant: 'Tête en avant : rentrez légèrement le menton',
  teteArriere: 'Tête en arrière : ramenez-la au-dessus des épaules',
  bustePenche: 'Buste penché : redressez-vous, rapprochez plutôt l’écran',
  avachi: 'Dos avachi : asseyez-vous au fond de la chaise',
};

function pireNiveau(cou: Niveau, tronc: Niveau): Niveau {
  return GRAVITE[cou] >= GRAVITE[tronc] ? cou : tronc;
}

/**
 * Cause d'une posture orange ou rouge : l'angle au pire niveau, le cou d'abord
 * à niveau égal. null si la posture est bonne, non mesurable ou absente.
 */
export function causeDe(mesure: Mesure): Cause | null {
  if (!mesure.personne) return null;
  const { cou, tronc } = mesure;
  const pire = pireNiveau(cou.niveau, tronc.niveau);
  if (pire !== 'orange' && pire !== 'rouge') return null;
  if (cou.niveau === pire) return (cou.angle ?? 0) > 90 ? 'teteArriere' : 'teteAvant';
  return tronc.sens === 'arriere' ? 'avachi' : 'bustePenche';
}

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
  const pire = pireNiveau(mesure.cou.niveau, mesure.tronc.niveau);
  if (pire === 'gris') {
    return etat('Position non mesurable', 'Oreille, épaule et hanche doivent être visibles');
  }
  if (pire === 'vert') {
    return { titre: 'Bonne posture', conseil: 'Continuez comme ça', alerte: false, niveau: 'vert' };
  }
  const cause = causeDe(mesure) as Cause;
  return { titre: VERDICT[pire], conseil: CONSEILS[cause], alerte: true, niveau: pire };
}

export const SEUILS_ALERTE = {
  // 30 s de mauvaise posture : choisi pour que l'app réagisse vite (le Pi, lui,
  // confirme pendant 1 min avant d'alerter).
  dureeMs: 30_000,
  // Un retour à la bonne posture plus court (boire, s'étirer) ne remet pas le
  // compte à zéro. Choisi à la main.
  toleranceMs: 5_000,
  // Au plus une notification toutes les 10 min, comme l'anti-rafale du Pi.
  entreDeuxMs: 10 * 60_000,
};

/**
 * Dit quand notifier : posture orange ou rouge depuis `dureeMs`, les retours à
 * la bonne posture plus courts que `toleranceMs` tolérés. Renvoie alors la
 * cause qui a duré le plus longtemps sur cette période, sinon null.
 * Une mesure sans posture jugée (personne absente, téléphone qui bouge) ne
 * compte pas, mais une interruption plus longue que la tolérance remet le
 * compte à zéro. Une posture qui reste mauvaise est rappelée toutes les
 * `entreDeuxMs`.
 */
export function creerSuiviAlerte(seuils = SEUILS_ALERTE) {
  let debutMauvaise: number | null = null;
  let derniereMauvaise = 0;
  let precedente: number | null = null;
  let derniereAlerte = -Infinity;
  const dureeParCause = new Map<Cause, number>();

  const remettreAZero = () => {
    debutMauvaise = null;
    dureeParCause.clear();
  };

  return {
    ajouter(mesure: Mesure, instant: number): Cause | null {
      const jugee =
        mesure.personne &&
        mesure.telephone !== 'mouvement' &&
        mesure.telephone !== 'penche' &&
        pireNiveau(mesure.cou.niveau, mesure.tronc.niveau) !== 'gris';
      const duree = jugee && precedente !== null ? Math.min(instant - precedente, 1000) : 0;
      precedente = jugee ? instant : null;
      const cause = jugee ? causeDe(mesure) : null;

      if (!cause) {
        if (debutMauvaise !== null && instant - derniereMauvaise > seuils.toleranceMs) {
          remettreAZero();
        }
        return null;
      }
      debutMauvaise ??= instant;
      derniereMauvaise = instant;
      dureeParCause.set(cause, (dureeParCause.get(cause) ?? 0) + duree);
      if (instant - debutMauvaise < seuils.dureeMs) return null;
      if (instant - derniereAlerte < seuils.entreDeuxMs) return null;
      derniereAlerte = instant;
      return [...dureeParCause].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    },
    reinitialiser() {
      remettreAZero();
      precedente = null;
    },
  };
}

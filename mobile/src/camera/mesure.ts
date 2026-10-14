/** Message de la carte de statut de l'écran « Session en cours », d'après la mesure du moment. */

import type { MessageMesure } from '../page/messages';
import type { Niveau } from '../page/posture';

export type { Niveau };

/** Mesure reçue de la page (forme définie une seule fois dans src/page/messages.ts). */
export type Mesure = MessageMesure;

/** Message principal de la carte de statut, du plus urgent au plus rassurant. */
export function messagePosture(mesure: Mesure | null): {
  titre: string;
  conseil: string;
  alerte: boolean;
} {
  if (!mesure) {
    return {
      titre: 'Démarrage de la caméra…',
      conseil: 'Autorisez l’accès à la caméra',
      alerte: false,
    };
  }
  if (!mesure.personne) {
    return {
      titre: 'Aucune personne détectée',
      conseil: 'Placez-vous de profil, face à l’écran du téléphone',
      alerte: false,
    };
  }
  const { cou, tronc } = mesure;
  if (cou.niveau === 'gris' && tronc.niveau === 'gris') {
    return {
      titre: 'Position non mesurable',
      conseil: 'Oreille, épaule et hanche doivent être visibles',
      alerte: false,
    };
  }
  if (cou.niveau === 'rouge' || cou.niveau === 'orange') {
    return {
      titre: 'Tête en avant détectée',
      conseil: 'Rentrez légèrement le menton',
      alerte: true,
    };
  }
  if (tronc.niveau === 'rouge' || tronc.niveau === 'orange') {
    if (tronc.sens === 'arriere') {
      return {
        titre: 'Dos avachi détecté',
        conseil: 'Asseyez-vous au fond de la chaise, le dos contre le dossier',
        alerte: true,
      };
    }
    return {
      titre: 'Buste penché en avant',
      conseil: 'Redressez-vous, rapprochez plutôt l’écran',
      alerte: true,
    };
  }
  return { titre: 'Bonne posture', conseil: 'Continuez comme ça', alerte: false };
}

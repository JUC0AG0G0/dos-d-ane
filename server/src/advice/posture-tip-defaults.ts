import type { PostureTipKey } from './advice.constants.js';

export interface PostureTipTexts {
  title: string;
  shortText: string;
  tutorialText: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
}

/**
 * Textes par défaut des 6 réglages du poste (bouton « Rétablir les textes
 * par défaut »). Identiques à ceux insérés par la migration
 * 20261018101000_advice_initial_content : les garder synchronisés.
 */
export const POSTURE_TIP_DEFAULTS = {
  ecran: {
    title: 'Écran à hauteur des yeux',
    shortText:
      'Le haut de l’écran au niveau des yeux ou un peu en dessous, à une longueur de bras (50 à 70 cm).',
    tutorialText:
      'Le haut de l’écran arrive au niveau de vos yeux, ou un peu en dessous. Placez-le à une longueur de bras : bras tendu, vos doigts touchent presque l’écran. Avec un portable, surélevez-le et branchez un clavier.',
    sourceLabel: 'INRS · Le travail sur écran',
    sourceUrl:
      'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html',
  },
  dossier: {
    title: 'Dos appuyé',
    shortText:
      'Le dossier soutient le bas du dos. L’assise n’appuie pas derrière les genoux.',
    tutorialText:
      'Asseyez-vous au fond de la chaise pour que le dossier soutienne le creux du bas du dos. Réglez la profondeur d’assise pour garder deux à trois doigts entre le bord du siège et l’arrière des genoux.',
    sourceLabel: 'INRS · Le travail sur écran',
    sourceUrl:
      'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html',
  },
  pieds: {
    title: 'Pieds à plat',
    shortText:
      'Pieds au sol ou sur un repose-pieds, cuisses à peu près horizontales.',
    tutorialText:
      'Réglez la hauteur du siège pour poser les pieds à plat au sol, cuisses à peu près horizontales. Si vos pieds ne touchent pas le sol une fois le siège réglé pour le bureau, utilisez un repose-pieds.',
    sourceLabel: 'INRS · Le travail sur écran',
    sourceUrl:
      'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html',
  },
  clavier: {
    title: 'Coudes près du corps',
    shortText: 'Coudes vers 90°, avant-bras posés, clavier et souris proches.',
    tutorialText:
      'Gardez les coudes près du corps, pliés à environ 90°, avant-bras posés sur le bureau ou les accoudoirs. Placez le clavier à 10 à 15 cm du bord du bureau et la souris juste à côté, pour ne pas tendre le bras.',
    sourceLabel: 'INRS · Le travail sur écran',
    sourceUrl:
      'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html',
  },
  lumiere: {
    title: 'Lumière sans reflet',
    shortText:
      'Écran perpendiculaire aux fenêtres, sans lumière vive devant ou derrière vous.',
    tutorialText:
      'Placez l’écran perpendiculaire aux fenêtres : ni lumière vive derrière l’écran, ni fenêtre dans votre dos qui se reflète dessus. Réglez la luminosité de l’écran sur celle de la pièce.',
    sourceLabel: 'INRS · Le travail sur écran',
    sourceUrl:
      'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html',
  },
  pauses: {
    title: 'Bouger toutes les heures',
    shortText:
      'Changez de position et levez-vous quelques minutes : aucune posture n’est bonne trop longtemps.',
    tutorialText:
      'Aucune posture n’est bonne si on la garde trop longtemps. Au moins toutes les heures, levez-vous et bougez quelques minutes : marchez, étirez-vous, allez chercher un verre d’eau.',
    sourceLabel: 'Assurance Maladie · ameli.fr',
    sourceUrl: 'https://www.ameli.fr/assure/sante/themes/tms',
  },
} as const satisfies Record<PostureTipKey, PostureTipTexts>;

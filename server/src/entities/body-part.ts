import { BodyPart } from '../generated/prisma/enums.js';

export { BodyPart };

/** Libellés français des articulations, pour l'affichage. */
export const bodyPartLabels: Record<BodyPart, string> = {
  [BodyPart.nose]: 'Tête (nez)',
  [BodyPart.left_eye]: 'Œil gauche',
  [BodyPart.right_eye]: 'Œil droit',
  [BodyPart.left_ear]: 'Oreille gauche',
  [BodyPart.right_ear]: 'Oreille droite',
  [BodyPart.left_shoulder]: 'Épaule gauche',
  [BodyPart.right_shoulder]: 'Épaule droite',
  [BodyPart.left_elbow]: 'Coude gauche',
  [BodyPart.right_elbow]: 'Coude droit',
  [BodyPart.left_wrist]: 'Poignet gauche',
  [BodyPart.right_wrist]: 'Poignet droit',
  [BodyPart.left_hip]: 'Bassin côté gauche',
  [BodyPart.right_hip]: 'Bassin côté droit',
  [BodyPart.left_knee]: 'Genou gauche',
  [BodyPart.right_knee]: 'Genou droit',
  [BodyPart.left_ankle]: 'Cheville gauche',
  [BodyPart.right_ankle]: 'Cheville droite',
};

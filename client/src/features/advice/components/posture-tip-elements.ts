import {
  Armchair,
  ArrowDownToLine,
  Clock,
  Keyboard,
  Monitor,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import type { PostureTipKey } from '../types/advice.types';

/** Élément du poste derrière chaque réglage : fixe, comme son icône et son repère. */
export const POSTURE_TIP_ELEMENTS: Record<
  PostureTipKey,
  { label: string; icon: LucideIcon }
> = {
  ecran: { label: 'Écran', icon: Monitor },
  dossier: { label: 'Dossier', icon: Armchair },
  pieds: { label: 'Pieds', icon: ArrowDownToLine },
  clavier: { label: 'Clavier et souris', icon: Keyboard },
  lumiere: { label: 'Lumière', icon: Sun },
  pauses: { label: 'Pauses', icon: Clock },
};

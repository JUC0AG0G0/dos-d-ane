/** Clé d'un Raspberry Pi (GET /devices) ; null pour un autre appareil. */
export type KeyStatus = 'active' | 'pending' | 'revoked' | null;

export interface PiState {
  label: string;
  hint: string | null;
  variant: 'success' | 'warning' | 'outline';
  /** Peut être ajouté à une session (le serveur refuse sinon). */
  usable: boolean;
}

/**
 * État d'un Raspberry Pi, le même partout (Paramètres, sessions, accueil) ;
 * null si ce n'est pas un Raspberry Pi.
 */
export function piState(device: {
  type: string;
  keyStatus: KeyStatus;
  online: boolean | null;
}): PiState | null {
  if (device.type !== 'raspberry') return null;
  if (device.keyStatus === 'revoked')
    return {
      label: 'Clé révoquée',
      hint: 'Ne se connecte plus : à ajouter de nouveau avec le code de son étiquette (Paramètres).',
      variant: 'outline',
      usable: false,
    };
  if (device.keyStatus === 'pending')
    return {
      label: 'En attente',
      hint: 'Ajouté : il récupère sa clé dans quelques secondes.',
      variant: 'warning',
      usable: false,
    };
  if (!device.online)
    return {
      label: 'Hors ligne',
      hint: 'Pas connecté au serveur : éteint ou sans réseau.',
      variant: 'outline',
      usable: false,
    };
  return { label: 'En ligne', hint: null, variant: 'success', usable: true };
}

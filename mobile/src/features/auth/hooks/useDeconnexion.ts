import { useSession } from '@/store/auth.store';

import { authService } from '../services/auth.service';

/** Ferme la session côté serveur puis sur le téléphone, même si le serveur ne répond pas. */
export function useDeconnexion() {
  const { deconnecter } = useSession();
  return async function logout() {
    await authService.logout().catch(() => undefined);
    await deconnecter();
  };
}

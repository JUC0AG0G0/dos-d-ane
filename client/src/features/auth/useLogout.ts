import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { useAuthStore } from '@/store';

/** Ferme la session côté serveur, vide le store et renvoie à la connexion. */
export function useLogout() {
  const navigate = useNavigate();

  return async function logout() {
    // La session locale est vidée même si le serveur ne répond pas.
    await authService.logout().catch(() => undefined);
    useAuthStore.getState().signOut();
    navigate('/login', { replace: true });
  };
}

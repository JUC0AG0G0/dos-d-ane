import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, authService } from '@/services';
import { useAuthStore } from '@/store';

/** Connecte l'utilisateur, garde la session dans le store puis va à l'accueil. */
export function useLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function login(email: string, password: string) {
    setPending(true);
    setError(null);
    try {
      const deviceId = useAuthStore.getState().deviceId ?? undefined;
      const session = await authService.login({
        email,
        password,
        device: { id: deviceId, type: 'web' },
      });
      useAuthStore.getState().signIn(session);
      navigate('/', { replace: true });
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 401
          ? 'Email ou mot de passe incorrect.'
          : e instanceof ApiError
            ? e.message
            : 'Serveur injoignable, réessaie dans un instant.',
      );
    } finally {
      setPending(false);
    }
  }

  return { login, error, pending };
}

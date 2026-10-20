import { useState } from 'react';

import { ApiError } from '@/services/http';
import { idAppareil, useSession } from '@/store/auth.store';

import { authService } from '../services/auth.service';
import { SERVEUR_INJOIGNABLE } from '../utils';

/** Connecte l'utilisateur et garde la session ; l'app passe alors à l'accueil. */
export function useConnexion() {
  const { connecter } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function login(email: string, password: string) {
    setPending(true);
    setError(null);
    try {
      const reponse = await authService.login({
        email: email.trim(),
        password,
        device: { id: await idAppareil(), type: 'mobile' },
      });
      await connecter(reponse);
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 401
          ? 'Email ou mot de passe incorrect.'
          : e instanceof ApiError
            ? e.message
            : SERVEUR_INJOIGNABLE,
      );
    } finally {
      setPending(false);
    }
  }

  return { login, error, pending };
}

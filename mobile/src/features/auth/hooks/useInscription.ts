import { router } from 'expo-router';
import { useState } from 'react';

import { ApiError } from '@/services/http';

import { authService } from '../services/auth.service';
import type { RegisterInput } from '../types/auth.types';
import { SERVEUR_INJOIGNABLE } from '../utils';

/** Crée le compte puis renvoie vers la connexion, email prérempli. */
export function useInscription() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function register(input: RegisterInput) {
    setPending(true);
    setError(null);
    try {
      await authService.register({ ...input, email: input.email.trim() });
      router.replace({
        pathname: '/connexion',
        params: { email: input.email.trim(), inscrit: '1' },
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : SERVEUR_INJOIGNABLE);
    } finally {
      setPending(false);
    }
  }

  return { register, error, pending };
}

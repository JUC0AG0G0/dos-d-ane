import { router } from 'expo-router';
import { useState } from 'react';

import { ApiError } from '@/services/http';

import { authService } from './service';
import { idAppareil, useSession } from './session';
import type { RegisterInput } from './types';

const SERVEUR_INJOIGNABLE =
  'Serveur injoignable, réessaie dans un instant. Es-tu bien sur le Wi-Fi de l’école ?';

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

/** Ferme la session côté serveur puis sur le téléphone, même si le serveur ne répond pas. */
export function useDeconnexion() {
  const { deconnecter } = useSession();
  return async function logout() {
    await authService.logout().catch(() => undefined);
    await deconnecter();
  };
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, authService } from '@/services';
import type { RegisterInput } from '@/types/auth';

/** Crée le compte puis renvoie vers la connexion, email prérempli. */
export function useRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function register(input: RegisterInput) {
    setPending(true);
    setError(null);
    try {
      await authService.register(input);
      navigate('/login', { state: { registeredEmail: input.email } });
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : 'Serveur injoignable, réessaie dans un instant.',
      );
    } finally {
      setPending(false);
    }
  }

  return { register, error, pending };
}

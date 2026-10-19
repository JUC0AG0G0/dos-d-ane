import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/services';
import { sessionsService } from '../services/sessions.service';
import type { SessionDetail } from '../types/sessions.types';

/**
 * Détail d'une session. notFound : session absente ou d'un autre utilisateur
 * (404). setSession remplace le détail par celui renvoyé après une action.
 */
export function useSession(id: string) {
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    sessionsService
      .get(id)
      .then((value) => {
        if (cancelled) return;
        setSession(value);
        setError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof ApiError && (e.status === 404 || e.status === 400)) {
          setNotFound(true);
        } else {
          setError('Impossible de charger la session.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    session: session?.id === id ? session : null,
    setSession,
    notFound,
    error,
    reload,
  };
}

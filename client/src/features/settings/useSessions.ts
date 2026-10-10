import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services';
import type { Session } from '@/types/auth';

/** Sessions de l'utilisateur (actives et passées), rechargeables après une action. */
export function useSessions() {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setSessions(await authService.sessions());
      setError(null);
    } catch {
      setError('Impossible de charger les appareils connectés.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    authService
      .sessions()
      .then((list) => !cancelled && setSessions(list))
      .catch(
        () =>
          !cancelled &&
          setError('Impossible de charger les appareils connectés.'),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    active: sessions?.filter((s) => s.active) ?? [],
    past: sessions?.filter((s) => !s.active) ?? [],
    loading: sessions === null && error === null,
    error,
    reload,
  };
}

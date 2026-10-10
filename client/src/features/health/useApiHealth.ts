import { useEffect, useState } from 'react';
import { ApiError, healthService } from '@/services';

export type ApiHealthState = 'loading' | 'up' | 'database-down' | 'unreachable';

/** État de l'API et de la base, vérifié une fois au montage. */
export function useApiHealth(): ApiHealthState {
  const [state, setState] = useState<ApiHealthState>('loading');

  useEffect(() => {
    let cancelled = false;
    healthService
      .get()
      .then(() => !cancelled && setState('up'))
      // 503 : l'API répond mais la base est injoignable.
      .catch((error: unknown) => {
        if (cancelled) return;
        const databaseDown = error instanceof ApiError && error.status === 503;
        setState(databaseDown ? 'database-down' : 'unreachable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

import { useEffect, useState } from 'react';
import { getHealth } from './api';

export type ApiHealthState = 'loading' | 'up' | 'database-down' | 'unreachable';

/** État de l'API et de la base, vérifié une fois au montage. */
export function useApiHealth(): ApiHealthState {
  const [state, setState] = useState<ApiHealthState>('loading');

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then(() => !cancelled && setState('up'))
      // 503 : l'API répond mais la base est injoignable.
      .catch((error: unknown) => {
        if (cancelled) return;
        const status = (error as { status?: number }).status;
        setState(status === 503 ? 'database-down' : 'unreachable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

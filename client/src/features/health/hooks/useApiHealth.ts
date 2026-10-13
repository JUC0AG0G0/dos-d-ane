import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/services';
import { healthService } from '../services/health.service';
import type { Health } from '../types/health.types';

export type ApiHealthState = 'loading' | 'up' | 'database-down' | 'unreachable';

interface ApiHealth {
  state: ApiHealthState;
  health: Health | null;
  checkedAt: Date | null;
}

async function check(): Promise<ApiHealth> {
  try {
    const health = await healthService.get();
    return { state: 'up', health, checkedAt: new Date() };
  } catch (error) {
    if (error instanceof ApiError && error.status === 503) {
      const health = error.body as Health;
      return { state: 'database-down', health, checkedAt: new Date() };
    }
    return { state: 'unreachable', health: null, checkedAt: new Date() };
  }
}

export function useApiHealth() {
  const [result, setResult] = useState<ApiHealth>({
    state: 'loading',
    health: null,
    checkedAt: null,
  });

  const refresh = useCallback(async () => {
    setResult((previous) => ({ ...previous, state: 'loading' }));
    setResult(await check());
  }, []);

  useEffect(() => {
    let cancelled = false;
    check().then((next) => !cancelled && setResult(next));
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...result, refresh };
}

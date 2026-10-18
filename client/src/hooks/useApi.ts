import { useCallback, useEffect, useState, type DependencyList } from 'react';

/**
 * Charge une ressource de l'API et la recharge quand deps change.
 * reload() la relit après une modification.
 */
export function useApi<T>(
  load: () => Promise<T>,
  deps: DependencyList,
  errorMessage = 'Impossible de charger le contenu.',
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((value) => {
        if (cancelled) return;
        setData(value);
        setError(null);
      })
      .catch(() => !cancelled && setError(errorMessage));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data,
    setData,
    loading: data === null && error === null,
    error,
    reload,
  };
}

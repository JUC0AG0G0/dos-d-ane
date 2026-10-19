import { useEffect } from 'react';

/**
 * Relance reload toutes les ms millisecondes tant que enabled, seulement quand
 * l'onglet est visible ; un retour sur l'onglet relance tout de suite.
 */
export function usePolling(reload: () => void, ms: number, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      clearInterval(timer);
      timer = setInterval(reload, ms);
    };
    const onVisibility = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        reload();
        start();
      }
    };
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reload, ms, enabled]);
}

import { useEffect, useState } from 'react';

/** Heure courante (ms), mise à jour chaque seconde : chronos et « il y a 4 s ». */
export function useNow(enabled = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [enabled]);
  return now;
}

import { useEffect, useState } from 'react';

type CountdownState =
  | { status: 'idle' }
  | { status: 'running'; endsAt: number }
  | { status: 'paused'; remainingMs: number }
  | { status: 'done' };

/**
 * Minuteur d'exercice : décompte calé sur l'horloge (pas de dérive si
 * l'onglet passe en arrière-plan), avec pause, reprise et remise à zéro.
 */
export function useCountdown(totalSeconds: number, autoStart = false) {
  const totalMs = totalSeconds * 1000;
  const [now, setNow] = useState(() => Date.now());
  const [state, setState] = useState<CountdownState>(() =>
    autoStart
      ? { status: 'running', endsAt: Date.now() + totalMs }
      : { status: 'idle' },
  );

  useEffect(() => {
    if (state.status !== 'running') return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= state.endsAt) setState({ status: 'done' });
    }, 200);
    return () => window.clearInterval(timer);
  }, [state]);

  const remainingMs =
    state.status === 'running'
      ? Math.max(0, state.endsAt - now)
      : state.status === 'paused'
        ? state.remainingMs
        : state.status === 'done'
          ? 0
          : totalMs;

  return {
    status: state.status,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    /** Part écoulée, de 0 à 1. */
    progress: 1 - remainingMs / totalMs,
    start: () => {
      const current = Date.now();
      setNow(current);
      setState({ status: 'running', endsAt: current + totalMs });
    },
    pause: () =>
      setState((s) =>
        s.status === 'running'
          ? {
              status: 'paused',
              remainingMs: Math.max(0, s.endsAt - Date.now()),
            }
          : s,
      ),
    resume: () =>
      setState((s) => {
        if (s.status !== 'paused') return s;
        const current = Date.now();
        setNow(current);
        return { status: 'running', endsAt: current + s.remainingMs };
      }),
    reset: () => setState({ status: 'idle' }),
  };
}

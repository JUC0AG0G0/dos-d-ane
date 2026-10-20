import { useEffect, useState } from 'react';
import { ApiError } from '@/services';
import { sessionsService } from '../services/sessions.service';
import type {
  LiveState,
  LiveStatus,
  PostureEvent,
} from '../types/sessions.types';

const RETRY_MIN_MS = 1_000;
const RETRY_MAX_MS = 30_000;

/**
 * Suit une session en direct (flux /live des Raspberry Pi) : statut annoncé,
 * dernier état de chaque Pi, alertes reçues depuis l'ouverture. Se reconnecte
 * seul après une coupure (1 s, puis doublé jusqu'à 30 s) ; s'arrête quand la
 * session est finie, sur un refus (401, 403, 404) ou en quittant la page.
 */
export function useLiveSession(id: string, enabled = true) {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [states, setStates] = useState<Record<string, LiveState>>({});
  const [alerts, setAlerts] = useState<PostureEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let finished = false;
    let wait = RETRY_MIN_MS;

    const onEvent = (event: string, data: string) => {
      setConnected(true);
      wait = RETRY_MIN_MS;
      if (event === 'status') {
        const next = (JSON.parse(data) as { status: LiveStatus }).status;
        setStatus(next);
        // En pause, le Pi éteint sa webcam : son dernier état n'est plus vrai.
        if (next !== 'running') setStates({});
        finished = next === 'ended' || next === 'deleted';
      } else if (event === 'state') {
        const state = JSON.parse(data) as LiveState;
        setStates((all) => ({ ...all, [state.deviceId]: state }));
      } else if (event === 'alert') {
        const alert = JSON.parse(data) as PostureEvent;
        // La fin d'une alerte remplace son début (même id).
        setAlerts((all) => [...all.filter((a) => a.id !== alert.id), alert]);
      }
    };

    const follow = async () => {
      while (!controller.signal.aborted && !finished) {
        try {
          await sessionsService.live(id, onEvent, controller.signal);
        } catch (error) {
          if (controller.signal.aborted) return;
          // Refus du serveur : réessayer ne changerait rien.
          if (error instanceof ApiError && error.status < 500) return;
        }
        setConnected(false);
        if (finished || controller.signal.aborted) return;
        await new Promise((resolve) => setTimeout(resolve, wait));
        wait = Math.min(wait * 2, RETRY_MAX_MS);
      }
    };
    void follow();
    return () => controller.abort();
  }, [id, enabled]);

  return { status, states, alerts, connected };
}

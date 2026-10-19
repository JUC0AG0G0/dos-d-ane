import { useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { usePolling } from '@/hooks/usePolling';
import { sessionsService } from '../services/sessions.service';
import { isLive } from '../utils';

/** Rafraîchissement de l'accueil pendant une session en cours ou en pause. */
const REFRESH_MS = 15_000;

/**
 * Données de l'accueil : sessions ouvertes, trois dernières terminées,
 * chiffres de la semaine et appareils.
 */
export function useHome() {
  const open = useApi(
    () => sessionsService.list('open'),
    [],
    'Impossible de charger vos sessions.',
  );
  const ended = useApi(
    () => sessionsService.list('ended', 3),
    [],
    'Impossible de charger vos sessions.',
  );
  const stats = useApi(sessionsService.stats, []);
  const devices = useApi(
    sessionsService.devices,
    [],
    'Impossible de charger vos appareils.',
  );

  const live = open.data?.filter((s) => isLive(s.status)) ?? [];
  const { reload: reloadOpen } = open;
  const { reload: reloadEnded } = ended;
  const { reload: reloadStats } = stats;
  const { reload: reloadDevices } = devices;
  const reload = useCallback(() => {
    reloadOpen();
    reloadEnded();
    reloadStats();
    reloadDevices();
  }, [reloadOpen, reloadEnded, reloadStats, reloadDevices]);
  usePolling(reload, REFRESH_MS, live.length > 0);

  return {
    open: open.data,
    live,
    ended: ended.data,
    sessionsError: open.error ?? ended.error,
    stats: stats.data,
    devices: devices.data,
    devicesError: devices.error,
  };
}

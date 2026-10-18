import { useEffect, useMemo } from 'react';
import { analysisService } from '@/features/analysis';
import { settingsService } from '@/features/settings';
import { useApi } from '@/hooks/useApi';

/** Rafraîchissement pendant une session ouverte (captures, appareils). */
const REFRESH_MS = 10_000;

/**
 * Données de l'accueil : sessions d'analyse, détail de la session ouverte
 * (en préparation ou en cours) et appareils connectés.
 */
export function useHome() {
  const sessions = useApi(
    analysisService.sessions,
    [],
    'Impossible de charger vos sessions.',
  );
  const open = sessions.data?.find((s) => s.status !== 'ended') ?? null;
  const openId = open?.id ?? null;

  const detail = useApi(
    () => (openId ? analysisService.session(openId) : Promise.resolve(null)),
    [openId],
  );
  const authSessions = useApi(
    settingsService.sessions,
    [],
    'Impossible de charger vos appareils.',
  );

  const { reload: reloadSessions } = sessions;
  const { reload: reloadDetail } = detail;
  useEffect(() => {
    if (!openId) return;
    const timer = setInterval(() => {
      reloadSessions();
      reloadDetail();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [openId, reloadSessions, reloadDetail]);

  const devices = useMemo(() => {
    const active = authSessions.data?.filter((s) => s.active) ?? [];
    const byId = new Map(
      active.map((s) => [s.device.id, { ...s.device, current: s.current }]),
    );
    return [...byId.values()].sort(
      (a, b) => Number(a.current) - Number(b.current),
    );
  }, [authSessions.data]);

  return {
    sessions: sessions.data,
    sessionsError: sessions.error,
    open,
    openDetail: detail.data?.id === openId ? detail.data : null,
    devices: authSessions.data ? devices : null,
    devicesError: authSessions.error,
  };
}

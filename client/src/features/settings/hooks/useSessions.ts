import { useApi } from '@/hooks/useApi';
import { settingsService } from '../services/settings.service';

/** Sessions de l'utilisateur (actives et passées), rechargeables après une action. */
export function useSessions() {
  const {
    data: sessions,
    loading,
    error,
    reload,
  } = useApi(
    settingsService.sessions,
    [],
    'Impossible de charger les appareils connectés.',
  );
  return {
    active: sessions?.filter((s) => s.active) ?? [],
    past: sessions?.filter((s) => !s.active) ?? [],
    loading,
    error,
    reload,
  };
}

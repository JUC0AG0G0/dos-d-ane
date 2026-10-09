import { useApiHealth, type ApiHealthState } from './useApiHealth';

const LABELS: Record<ApiHealthState, string> = {
  loading: 'Connexion au serveur…',
  up: 'Serveur et base de données joignables',
  'database-down': 'Serveur joignable, base de données injoignable',
  unreachable: 'Serveur injoignable',
};

/** Pastille indiquant si le front parle bien au serveur. */
export function ApiStatus() {
  const state = useApiHealth();
  return (
    <p className={`api-status api-status--${state}`} role="status">
      {LABELS[state]}
    </p>
  );
}

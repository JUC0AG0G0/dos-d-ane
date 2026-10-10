import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useApiHealth, type ApiHealthState } from './useApiHealth';

const STATES = {
  loading: {
    variant: 'default',
    Icon: LoaderCircle,
    label: 'Connexion au serveur…',
  },
  up: {
    variant: 'success',
    Icon: CircleCheck,
    label: 'Serveur et base de données joignables',
  },
  'database-down': {
    variant: 'warning',
    Icon: TriangleAlert,
    label: 'Serveur joignable, base de données injoignable',
  },
  unreachable: {
    variant: 'destructive',
    Icon: CircleAlert,
    label: 'Serveur injoignable',
  },
} as const satisfies Record<ApiHealthState, unknown>;

/** Indique si le front parle bien au serveur. */
export function ApiStatus() {
  const { variant, Icon, label } = STATES[useApiHealth()];
  return (
    <Alert variant={variant} role="status">
      <Icon />
      <AlertTitle>{label}</AlertTitle>
    </Alert>
  );
}

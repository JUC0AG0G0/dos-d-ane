import {
  CircleAlert,
  CircleCheck,
  Database,
  LoaderCircle,
  RefreshCw,
  Server,
  TriangleAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDateTime } from '@/utils/format';
import { useApiHealth, type ApiHealthState } from '../hooks/useApiHealth';

const SUMMARY = {
  loading: {
    variant: 'default',
    Icon: LoaderCircle,
    title: 'Vérification en cours…',
    description: 'Le client interroge le serveur.',
  },
  up: {
    variant: 'success',
    Icon: CircleCheck,
    title: 'Tout fonctionne',
    description: 'Le serveur et la base de données répondent.',
  },
  'database-down': {
    variant: 'warning',
    Icon: TriangleAlert,
    title: 'Service dégradé',
    description: 'Le serveur répond, mais la base de données est injoignable.',
  },
  unreachable: {
    variant: 'destructive',
    Icon: CircleAlert,
    title: 'Service indisponible',
    description: 'Le serveur ne répond pas.',
  },
} as const satisfies Record<ApiHealthState, unknown>;

function StatusBadge({ ok, loading }: { ok: boolean; loading: boolean }) {
  if (loading) return <Badge variant="outline">…</Badge>;
  return ok ? (
    <Badge variant="success">Opérationnel</Badge>
  ) : (
    <Badge variant="destructive">Injoignable</Badge>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </dt>
      <dd className="text-sm text-muted-foreground">{children}</dd>
    </div>
  );
}

export function ServiceStatusCard() {
  const { state, health, checkedAt, refresh } = useApiHealth();
  const loading = state === 'loading';
  const { variant, Icon, title, description } = SUMMARY[state];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">État du service</CardTitle>
        <CardDescription>
          {checkedAt
            ? `Dernière vérification : ${formatDateTime(checkedAt.toISOString())}`
            : 'Vérification de la connexion au serveur.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Alert variant={variant} role="status">
          <Icon className={loading ? 'animate-spin' : undefined} />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
        <dl className="divide-y rounded-lg border px-4">
          <Row
            icon={<Server className="size-4 text-primary" />}
            label="Serveur"
          >
            <StatusBadge ok={state !== 'unreachable'} loading={loading} />
          </Row>
          <Row
            icon={<Database className="size-4 text-primary" />}
            label="Base de données"
          >
            <StatusBadge ok={state === 'up'} loading={loading} />
          </Row>
          <Row label="Environnement">{health?.env ?? '—'}</Row>
          <Row label="Version">{health?.version ?? '—'}</Row>
        </dl>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={loading ? 'animate-spin' : undefined} />
          Actualiser
        </Button>
      </CardFooter>
    </Card>
  );
}

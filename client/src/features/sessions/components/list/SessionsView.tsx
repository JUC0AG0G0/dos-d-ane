import { Activity, ChevronRight, CircleAlert, Play } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoadState } from '@/components/LoadState';
import { PageHeader } from '@/components/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApi } from '@/hooks/useApi';
import { usePageCrumb } from '@/hooks/usePageCrumb';
import { usePolling } from '@/hooks/usePolling';
import { formatDateTime } from '@/utils/format';
import { useNewSession } from '../../hooks/useNewSession';
import { sessionsService } from '../../services/sessions.service';
import type { SessionSummary } from '../../types/sessions.types';
import {
  formatDuration,
  formatTime,
  isLive,
  plural,
  sessionResult,
} from '../../utils';
import { SessionStatusBadge } from '../SessionStatusBadge';
import { DevicesCell } from './DevicesCell';

/** Onglets : valeur de ?statut=, libellé, filtre et texte de l'onglet vide. */
const TABS = [
  {
    value: 'toutes',
    label: 'Toutes',
    empty: 'Aucune session',
    keep: () => true,
  },
  {
    value: 'preparation',
    label: 'En préparation',
    empty: 'Aucune session en préparation',
    keep: (s: SessionSummary) => s.status === 'setup',
  },
  {
    value: 'en-cours',
    label: 'En cours',
    empty: 'Aucune session en cours',
    keep: (s: SessionSummary) => isLive(s.status),
  },
  {
    value: 'terminees',
    label: 'Terminées',
    empty: 'Aucune session terminée',
    keep: (s: SessionSummary) => s.status === 'ended',
  },
] as const;

const NO_CAPTURE =
  'Ce sont vos appareils (téléphone, ordinateur, Raspberry) qui capturent, pas le navigateur.';

function NewSessionButton() {
  const { start, busy } = useNewSession();
  return (
    <Button onClick={start} disabled={busy}>
      <Play />
      Nouvelle session
    </Button>
  );
}

/** Alerte des sessions en cours ou en pause. */
function LiveAlert({ live }: { live: SessionSummary[] }) {
  if (live.length === 0) return null;
  if (live.length > 1) {
    return (
      <Link to="?statut=en-cours" className="block">
        <Alert variant="success" className="hover:border-primary">
          <Activity />
          <AlertTitle>{live.length} sessions sont en cours</AlertTitle>
          <AlertDescription>Voir les sessions en cours</AlertDescription>
        </Alert>
      </Link>
    );
  }
  const [session] = live;
  const active = session.devices.filter((d) => !d.leftAt).length;
  return (
    <Link to={`/sessions/${session.id}`} className="block">
      <Alert variant="success" className="hover:border-primary">
        <Activity />
        <AlertTitle>
          {session.status === 'paused'
            ? `Une session est en pause depuis ${formatTime(session.pausedSince!)}`
            : `Une session est en cours depuis ${formatTime(session.startedAt!)}`}
        </AlertTitle>
        <AlertDescription>
          {session.status === 'paused'
            ? 'Vos appareils n’envoient plus de captures.'
            : active === 1
              ? '1 appareil envoie des captures'
              : `${active} appareils envoient des captures`}
        </AlertDescription>
      </Alert>
    </Link>
  );
}

/** Mes sessions : onglets par état et historique. */
export function SessionsView() {
  usePageCrumb('Mes sessions');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.value === params.get('statut')) ?? TABS[0];
  const {
    data: sessions,
    error,
    reload,
  } = useApi(
    () => sessionsService.list(),
    [],
    'Impossible de charger vos sessions.',
  );
  const live = sessions?.filter((s) => isLive(s.status)) ?? [];
  usePolling(reload, 15_000, live.length > 0);

  const header = (
    <PageHeader
      title="Mes sessions"
      description="Préparez, suivez et retrouvez vos sessions d’analyse de posture."
      actions={<NewSessionButton />}
    />
  );

  if (!sessions) {
    return (
      <section className="grid gap-6">
        {header}
        <LoadState error={error} />
      </section>
    );
  }

  if (sessions.length === 0) {
    return (
      <section className="grid gap-6">
        {header}
        <div className="grid justify-items-center gap-3 rounded-xl border border-dashed bg-card px-7 py-10 text-center shadow-sm">
          <CircleAlert className="size-6 text-primary" />
          <h2 className="text-xl font-semibold">
            Aucune session pour l’instant
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Créez une session, choisissez vos appareils puis lancez-la.{' '}
            {NO_CAPTURE}
          </p>
          <NewSessionButton />
        </div>
      </section>
    );
  }

  const shown = sessions.filter(tab.keep);

  return (
    <section className="grid gap-6">
      {header}
      <LiveAlert live={live} />
      <Tabs
        value={tab.value}
        onValueChange={(value) => setParams({ statut: value })}
      >
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>{plural(shown.length, 'session')}</CardDescription>
        </CardHeader>
        <CardContent>
          {shown.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {tab.empty}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Durée active</TableHead>
                  <TableHead>Appareils</TableHead>
                  <TableHead className="text-right">Résultat</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((session) => (
                  <TableRow
                    key={session.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  >
                    <TableCell className="font-medium">
                      <Link
                        to={`/sessions/${session.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {formatDateTime(session.startedAt ?? session.createdAt)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <SessionStatusBadge status={session.status} />
                    </TableCell>
                    <TableCell>
                      {session.durationSeconds === null ||
                      session.startedAt === session.endedAt
                        ? '—'
                        : formatDuration(session.durationSeconds)}
                    </TableCell>
                    <TableCell>
                      <DevicesCell session={session} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {session.startedAt ? sessionResult(session) : '—'}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

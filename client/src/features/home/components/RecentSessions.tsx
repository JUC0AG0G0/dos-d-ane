import { Activity, ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AnalysisSessionSummary } from '@/features/analysis';
import { formatCount, formatHours, formatTime, sessionTitle } from '../utils';
import { DeviceTile } from './DeviceTile';

const STATUS = {
  setup: { label: 'En préparation', variant: 'outline' },
  running: { label: 'En cours', variant: 'default' },
  ended: { label: 'Terminée', variant: 'secondary' },
} as const;

function meta(session: AnalysisSessionSummary) {
  const captures = `${formatCount(session.captureCount)} capture${session.captureCount > 1 ? 's' : ''}`;
  const devices = `${session.deviceCount} appareil${session.deviceCount > 1 ? 's' : ''}`;
  if (session.status === 'setup')
    return `créée à ${formatTime(session.createdAt)} · ${devices}`;
  const start = formatTime(session.startedAt!);
  if (session.status === 'running')
    return `${start} · en cours · ${captures} · ${devices}`;
  return `${start} → ${formatTime(session.endedAt!)} · ${formatHours(session.durationSeconds ?? 0)} · ${captures}`;
}

/** Les trois sessions les plus récentes. */
export function RecentSessions({
  sessions,
}: {
  sessions: AnalysisSessionSummary[];
}) {
  const recent = sessions.slice(0, 3);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dernières sessions</CardTitle>
        <CardDescription>Vos trois sessions les plus récentes.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sessions">
              Tout voir
              <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune session pour l’instant. Elles apparaîtront ici dès la
            première.
          </p>
        ) : (
          recent.map((session, index) => {
            const status = STATUS[session.status];
            return (
              <Fragment key={session.id}>
                {index > 0 && <Separator />}
                <Link
                  to={`/sessions/${session.id}`}
                  className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-3 hover:bg-accent"
                >
                  <DeviceTile
                    icon={session.status === 'ended' ? Calendar : Activity}
                  />
                  <div className="grid min-w-0 flex-1 gap-1 text-sm">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {sessionTitle(session)}
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </p>
                    <p className="text-muted-foreground">{meta(session)}</p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </Fragment>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

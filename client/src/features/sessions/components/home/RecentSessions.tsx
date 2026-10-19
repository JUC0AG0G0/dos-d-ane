import { Activity, ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { SessionSummary } from '../../types/sessions.types';
import {
  formatDuration,
  formatTime,
  isLive,
  isSingleCapture,
  plural,
  sessionTitle,
} from '../../utils';
import { DeviceTile } from '../DeviceTile';
import { SessionStatusBadge } from '../SessionStatusBadge';

/** « 09:02 → 11:58 · 2 h 56 min · 1 058 captures » */
function sessionMeta(session: SessionSummary) {
  const captures = plural(session.captureCount, 'capture');
  if (!session.startedAt) return `créée à ${formatTime(session.createdAt)}`;
  if (isSingleCapture(session)) return formatTime(session.startedAt);
  const end = session.endedAt ? formatTime(session.endedAt) : 'maintenant';
  return [
    `${formatTime(session.startedAt)} → ${end}`,
    formatDuration(session.durationSeconds ?? 0),
    captures,
  ].join(' · ');
}

/** Les trois sessions les plus récentes. */
export function RecentSessions({ sessions }: { sessions: SessionSummary[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dernières sessions</CardTitle>
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
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune session terminée pour l’instant.
          </p>
        ) : (
          sessions.map((session, index) => (
            <Fragment key={session.id}>
              {index > 0 && <Separator />}
              <Link
                to={`/sessions/${session.id}`}
                className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-3 hover:bg-accent"
              >
                <DeviceTile
                  icon={isLive(session.status) ? Activity : Calendar}
                />
                <div className="grid min-w-0 flex-1 gap-1 text-sm">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {sessionTitle(session)}
                    <SessionStatusBadge status={session.status} />
                  </p>
                  <p className="text-muted-foreground">
                    {sessionMeta(session)}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </Fragment>
          ))
        )}
      </CardContent>
    </Card>
  );
}

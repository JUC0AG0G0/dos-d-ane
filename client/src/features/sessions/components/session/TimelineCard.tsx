import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/utils/cn';
import { sessionsService } from '../../services/sessions.service';
import type { SessionPause } from '../../types/sessions.types';
import { formatTime, plural } from '../../utils';

const BUCKET_MINUTES = 10;
const BUCKET_MS = BUCKET_MINUTES * 60 * 1000;

/** Part de la tranche [start, start + BUCKET_MS) couverte par une pause. */
function pausedShare(start: number, pauses: SessionPause[], end: number) {
  const covered = pauses.reduce((sum, p) => {
    const from = Math.max(start, Date.parse(p.startedAt));
    const to = Math.min(
      start + BUCKET_MS,
      p.endedAt ? Date.parse(p.endedAt) : end,
    );
    return sum + Math.max(0, to - from);
  }, 0);
  return covered / BUCKET_MS;
}

/**
 * Captures dans le temps : histogramme par tranche de 10 minutes, tranches de
 * pause grisées, puis une phrase par pause et par trou hors pause.
 */
export function TimelineCard({
  sessionId,
  endedAt,
}: {
  sessionId: string;
  endedAt: string;
}) {
  const { data, error } = useApi(
    () => sessionsService.timeline(sessionId, BUCKET_MINUTES),
    [sessionId],
    'Impossible de charger la frise.',
  );
  const end = Date.parse(endedAt);

  let body;
  if (!data) {
    body = error ? (
      <p className="text-sm text-destructive">{error}</p>
    ) : (
      <Skeleton className="h-40" />
    );
  } else {
    const max = Math.max(1, ...data.buckets.map((b) => b.count));
    const bars = data.buckets.map((b) => {
      const start = Date.parse(b.start);
      return {
        ...b,
        startMs: start,
        paused: pausedShare(start, data.pauses, end) >= 0.5,
      };
    });
    // Trous : tranches consécutives sans capture et hors pause.
    const gaps: { from: number; to: number }[] = [];
    for (const bar of bars) {
      if (bar.count > 0 || bar.paused) continue;
      const to = Math.min(bar.startMs + BUCKET_MS, end);
      const last = gaps[gaps.length - 1];
      if (last && last.to === bar.startMs) last.to = to;
      else gaps.push({ from: bar.startMs, to });
    }
    const labelEvery = Math.max(1, Math.ceil(bars.length / 6));

    body = (
      <div className="grid gap-4">
        <div
          className="flex h-40 items-end gap-1"
          role="img"
          aria-label="Nombre de captures par tranche de 10 minutes"
        >
          {bars.map((bar) => (
            <div
              key={bar.start}
              title={`${formatTime(bar.startMs)} : ${bar.paused ? 'pause' : plural(bar.count, 'capture')}`}
              className="flex h-full min-w-1 flex-1 flex-col justify-end"
            >
              {bar.paused ? (
                <div className="flex h-full items-end justify-center rounded-t bg-muted-foreground/15 pb-1 text-[10px] text-muted-foreground [writing-mode:vertical-rl]">
                  Pause
                </div>
              ) : (
                <div
                  className={cn(
                    'rounded-t bg-primary',
                    bar.count === 0 && 'bg-transparent',
                  )}
                  style={{ height: `${(bar.count / max) * 100}%` }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-1 text-xs text-muted-foreground">
          {bars.map((bar, index) => (
            <span
              key={bar.start}
              className="min-w-1 flex-1 overflow-visible whitespace-nowrap"
            >
              {index % labelEvery === 0 ? formatTime(bar.startMs) : ''}
            </span>
          ))}
        </div>
        {(data.pauses.length > 0 || gaps.length > 0) && (
          <ul className="grid gap-1 text-sm text-muted-foreground">
            {data.pauses.map((p) => (
              <li key={p.startedAt}>
                Pause de {formatTime(p.startedAt)} à{' '}
                {formatTime(p.endedAt ?? endedAt)}
              </li>
            ))}
            {gaps.map((gap) => (
              <li key={gap.from}>
                Aucune capture de {formatTime(gap.from)} à {formatTime(gap.to)}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Captures dans le temps</CardTitle>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { PostureSummary, SessionDevice } from '../../types/sessions.types';
import { formatTime } from '../../utils';

/** Barres d'un Pi : une par résumé, hauteur = score. */
function ScoreBars({ summaries }: { summaries: PostureSummary[] }) {
  const labelEvery = Math.max(1, Math.ceil(summaries.length / 6));
  return (
    <div className="grid gap-2">
      <div
        className="flex h-32 items-end gap-1"
        role="img"
        aria-label="Score par période de 5 minutes"
      >
        {summaries.map((s) => (
          <div
            key={s.id}
            title={`${formatTime(s.periodStart)} → ${formatTime(s.periodEnd)} : ${
              s.score === null
                ? 'pas de score (image mal vue ou absent)'
                : `${s.score} %`
            }`}
            className="flex h-full min-w-1 flex-1 flex-col justify-end"
          >
            {s.score === null ? (
              <div className="h-1 rounded-t bg-muted-foreground/20" />
            ) : (
              <div
                className="rounded-t bg-primary"
                style={{ height: `${Math.max(s.score, 2)}%` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-1 text-xs text-muted-foreground">
        {summaries.map((s, index) => (
          <span
            key={s.id}
            className="min-w-1 flex-1 overflow-visible whitespace-nowrap"
          >
            {index % labelEvery === 0 ? formatTime(s.periodStart) : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Score de chaque période de 5 min, par Raspberry Pi : la posture se dégrade-t-elle ? */
export function ScoreTimelineCard({
  summaries,
  devices,
  error,
}: {
  summaries: PostureSummary[] | null;
  devices: SessionDevice[];
  error: string | null;
}) {
  const byDevice = new Map<string, PostureSummary[]>();
  for (const s of summaries ?? []) {
    byDevice.set(s.deviceId, [...(byDevice.get(s.deviceId) ?? []), s]);
  }
  const deviceName = (id: string) =>
    devices.find((d) => d.id === id)?.name ?? 'Appareil retiré';

  let body;
  if (error) {
    body = <p className="text-sm text-destructive">{error}</p>;
  } else if (!summaries) {
    body = <Skeleton className="h-32" />;
  } else if (summaries.length === 0) {
    body = (
      <p className="text-sm text-muted-foreground">
        Aucun bilan reçu du Raspberry Pi.
      </p>
    );
  } else {
    body = (
      <div className="grid gap-6">
        {[...byDevice].map(([deviceId, list]) => (
          <div key={deviceId} className="grid gap-2">
            {byDevice.size > 1 && (
              <p className="text-sm font-medium">{deviceName(deviceId)}</p>
            )}
            <ScoreBars summaries={list} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score toutes les 5 minutes</CardTitle>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}

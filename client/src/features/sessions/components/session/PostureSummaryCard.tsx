import { ChartPie } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { LiveColor, PostureSummary } from '../../types/sessions.types';
import {
  COLOR_LABELS,
  formatDuration,
  formatTime,
  postureTotals,
} from '../../utils';

/** Ordre de la barre et de la légende, et couleur de chaque état. */
const STATES: { color: LiveColor; className: string }[] = [
  { color: 'green', className: 'bg-primary' },
  { color: 'orange', className: 'bg-warning-icon' },
  { color: 'red', className: 'bg-destructive' },
  { color: 'ignored', className: 'bg-muted-foreground/40' },
  { color: 'absent', className: 'bg-muted-foreground/15' },
];

/**
 * Bilan des résumés des Raspberry Pi (un toutes les 5 min) : score de la
 * session et répartition du temps entre les états.
 */
export function PostureSummaryCard({
  summaries,
  error,
  live,
}: {
  summaries: PostureSummary[] | null;
  error: string | null;
  /** Session en cours : bilan depuis le début, qui avance par paliers. */
  live: boolean;
}) {
  const totals = summaries?.length ? postureTotals(summaries) : null;
  const last = summaries?.at(-1);

  let body;
  if (error) {
    body = <p className="text-sm text-destructive">{error}</p>;
  } else if (!summaries) {
    body = <Skeleton className="h-28" />;
  } else if (!totals || totals.total === 0) {
    body = (
      <p className="text-sm text-muted-foreground">
        {live
          ? 'Premier bilan dans quelques minutes : le Raspberry Pi en envoie un toutes les 5 minutes.'
          : 'Aucun bilan reçu du Raspberry Pi.'}
      </p>
    );
  } else {
    const share = (seconds: number) => (100 * seconds) / totals.total;
    body = (
      <div className="grid gap-4">
        <div>
          <p className="text-3xl font-semibold tabular-nums">
            {totals.score === null ? '—' : `${totals.score} %`}
          </p>
          <p className="text-sm text-muted-foreground">
            {totals.score === null
              ? 'Pas assez d’images bien vues pour un score'
              : 'du temps en bonne posture'}
          </p>
        </div>
        <div
          className="flex h-3 overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label="Répartition du temps entre les états"
        >
          {STATES.map(({ color, className }) => (
            <div
              key={color}
              className={className}
              style={{ width: `${share(totals.seconds[color])}%` }}
            />
          ))}
        </div>
        <ul className="grid gap-1.5 text-sm">
          {STATES.filter(({ color }) => totals.seconds[color] > 0).map(
            ({ color, className }) => (
              <li key={color} className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${className}`} />
                <span className="flex-1">{COLOR_LABELS[color]}</span>
                <span className="tabular-nums text-muted-foreground">
                  {Math.round(share(totals.seconds[color]))} % ·{' '}
                  {formatDuration(totals.seconds[color])}
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartPie className="size-4" />
          Bilan
        </CardTitle>
        <CardDescription>
          {live
            ? last
              ? `Depuis le début, jusqu’à ${formatTime(last.periodEnd)} · un bilan toutes les 5 min`
              : 'Depuis le début de la session'
            : 'Sur toute la session'}
        </CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}

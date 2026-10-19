import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { SessionPause } from '../../types/sessions.types';
import { formatDuration, formatTime, plural } from '../../utils';

/** Pauses de la session, la plus récente en haut. */
export function PausesCard({
  pauses,
  now,
}: {
  pauses: SessionPause[];
  now: number;
}) {
  if (pauses.length === 0) return null;
  const length = (p: SessionPause) =>
    ((p.endedAt ? Date.parse(p.endedAt) : now) - Date.parse(p.startedAt)) /
    1000;
  const total = pauses.reduce((sum, p) => sum + length(p), 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pauses</CardTitle>
        <CardDescription>
          {plural(pauses.length, 'pause')} · {formatDuration(total)} au total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {[...pauses].reverse().map((pause, index) => (
          <div key={pause.startedAt}>
            {index > 0 && <Separator />}
            <p className="py-2 text-sm">
              {formatTime(pause.startedAt)} →{' '}
              {pause.endedAt
                ? `${formatTime(pause.endedAt)} · ${formatDuration(length(pause))}`
                : 'maintenant'}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

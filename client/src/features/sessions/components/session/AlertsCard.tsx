import { TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PostureEvent, SessionDevice } from '../../types/sessions.types';
import { EVENT_LABELS, formatTime, plural } from '../../utils';

/** « 45 s », « 4 min 10 s » : une alerte dure souvent moins d'une minute. */
function alertDuration(seconds: number) {
  if (seconds < 60) return `${seconds} s`;
  const rest = seconds % 60;
  return `${Math.floor(seconds / 60)} min${rest ? ` ${rest} s` : ''}`;
}

/** Alertes des Raspberry Pi de la session, la plus récente en premier. */
export function AlertsCard({
  alerts,
  devices,
  error,
}: {
  alerts: PostureEvent[];
  devices: SessionDevice[];
  error: string | null;
}) {
  const deviceName = (id: string) =>
    devices.find((d) => d.id === id)?.name ?? 'Appareil retiré';
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TriangleAlert className="size-4" />
          Alertes
        </CardTitle>
        <CardDescription>
          {alerts.length
            ? plural(alerts.length, 'alerte')
            : 'Une alerte apparaît après 1 minute de mauvaise posture.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!error && alerts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune alerte pour l’instant.
          </p>
        )}
        {alerts.map((alert, index) => (
          <div key={alert.id} className="grid gap-3">
            {index > 0 && <Separator />}
            <div className="flex items-start justify-between gap-3 text-sm">
              <div className="grid gap-1">
                <p className="font-medium">{EVENT_LABELS[alert.type]}</p>
                <p className="text-muted-foreground">
                  {formatTime(alert.startedAt)}
                  {alert.endedAt && ` → ${formatTime(alert.endedAt)}`}
                  {devices.length > 1 && ` · ${deviceName(alert.deviceId)}`}
                </p>
              </div>
              {alert.endedAt ? (
                <span className="tabular-nums text-muted-foreground">
                  {alertDuration(alert.durationSeconds ?? 0)}
                </span>
              ) : (
                <Badge variant="destructive">En cours</Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

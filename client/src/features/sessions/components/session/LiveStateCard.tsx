import { Activity } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type {
  LiveColor,
  LiveState,
  SessionDevice,
} from '../../types/sessions.types';
import { formatAgo, POSTURE_LABELS } from '../../utils';

const COLORS: Record<
  LiveColor,
  { label: string; variant: ComponentProps<typeof Badge>['variant'] }
> = {
  green: { label: 'Tout va bien', variant: 'success' },
  orange: { label: 'À surveiller', variant: 'warning' },
  red: { label: 'Alerte', variant: 'destructive' },
  ignored: { label: 'Image mal vue', variant: 'outline' },
  absent: { label: 'Personne absente', variant: 'secondary' },
};

const degrees = (value: number | null) =>
  value === null ? '—' : `${Math.round(value)}°`;

/** État en direct des Raspberry Pi de la session (flux /live). */
export function LiveStateCard({
  devices,
  states,
  paused,
  connected,
  now,
}: {
  devices: SessionDevice[];
  states: Record<string, LiveState>;
  paused: boolean;
  connected: boolean;
  now: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4" />
          En direct
        </CardTitle>
        <CardDescription>
          {paused
            ? 'En pause : la webcam du Raspberry Pi est éteinte'
            : connected
              ? 'Mis à jour à chaque image analysée par le Raspberry Pi'
              : 'Connexion au serveur…'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {devices.map((device, index) => {
          const state = states[device.id];
          return (
            <div key={device.id} className="grid gap-3">
              {index > 0 && <Separator />}
              {devices.length > 1 && (
                <p className="text-sm font-medium">{device.name}</p>
              )}
              {state ? (
                <LiveStateDetails state={state} now={now} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {paused
                    ? 'L’analyse reprendra à la fin de la pause.'
                    : 'En attente de la première image du Raspberry Pi…'}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function LiveStateDetails({ state, now }: { state: LiveState; now: number }) {
  const color = COLORS[state.color];
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={color.variant}>{color.label}</Badge>
        {state.posture && (
          <span className="font-medium">{POSTURE_LABELS[state.posture]}</span>
        )}
      </div>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <LiveValue label="Tête" value={degrees(state.headAngle)} />
        <LiveValue label="Tronc" value={degrees(state.trunkAngle)} />
        <LiveValue
          label="Score"
          value={state.score === null ? '—' : `${state.score} / 100`}
        />
      </dl>
      <p className="text-xs text-muted-foreground">
        Dernière image {formatAgo(state.receivedAt, now)}
      </p>
    </>
  );
}

function LiveValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

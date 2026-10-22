import { Settings } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { piState } from '@/utils/raspberry';
import type {
  Device,
  SessionStatus,
  SessionSummary,
} from '../../types/sessions.types';
import { DeviceTile } from '../DeviceTile';

type DeviceState = {
  badge: string;
  variant: 'default' | 'warning' | 'secondary' | 'success' | 'outline';
  text: string;
};

/**
 * Badge d'un appareil de capture : un Raspberry Pi inutilisable (clé, hors
 * ligne) d'abord, sinon selon la session lancée où il capture.
 */
function deviceState(
  device: Device,
  sessionStatus: SessionStatus | undefined,
): DeviceState {
  const pi = piState(device);
  if (pi && !pi.usable)
    return { badge: pi.label, variant: pi.variant, text: pi.hint ?? '' };
  if (sessionStatus === 'running')
    return {
      badge: 'Actif',
      variant: 'default',
      text: 'Dans une session en cours',
    };
  if (sessionStatus === 'paused')
    return {
      badge: 'En pause',
      variant: 'warning',
      text: 'Sa session est en pause',
    };
  return { badge: 'Disponible', variant: 'secondary', text: 'Prêt à capturer' };
}

/** Appareils pouvant capturer, puis ce navigateur. */
export function HomeDevices({
  devices,
  openSessions,
  waiting,
}: {
  devices: Device[];
  openSessions: SessionSummary[];
  /** Première visite : texte d'attente sous « Ce navigateur ». */
  waiting?: boolean;
}) {
  const statusById = new Map(openSessions.map((s) => [s.id, s.status]));
  const capturing = devices.filter((d) => d.captureEligible);
  const browser = devices.find((d) => d.current && !d.captureEligible);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos appareils</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings/devices">
              <Settings />
              Gérer
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {capturing.map((device, index) => {
          const state = deviceState(
            device,
            device.openSessionId
              ? statusById.get(device.openSessionId)
              : undefined,
          );
          return (
            <Fragment key={device.id}>
              {index > 0 && <Separator />}
              <div className="flex items-center gap-4 py-3">
                <DeviceTile type={device.type} />
                <div className="grid min-w-0 flex-1 gap-1 text-sm">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {device.name}
                    <Badge variant={state.variant}>{state.badge}</Badge>
                  </p>
                  <p className="text-muted-foreground">{state.text}</p>
                </div>
              </div>
            </Fragment>
          );
        })}
        {browser && (
          <>
            {capturing.length > 0 && <Separator />}
            <div className="flex items-center gap-4 py-3">
              <DeviceTile type="web" />
              <div className="grid min-w-0 flex-1 gap-1 text-sm">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  Ce navigateur
                  <Badge variant="outline">Cet appareil</Badge>
                </p>
                <p className="text-muted-foreground">Consultation seulement</p>
              </div>
            </div>
          </>
        )}
        {waiting && (
          <p className="pt-2 text-sm text-muted-foreground">
            Vos appareils de capture apparaîtront ici dès que vous vous serez
            connecté avec l’application.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

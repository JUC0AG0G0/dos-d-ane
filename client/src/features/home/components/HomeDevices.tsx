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
import type { SessionDevice } from '@/features/settings';
import { DeviceTile } from './DeviceTile';

export type HomeDevice = SessionDevice & { current: boolean };

function state(device: HomeDevice, inSession: boolean) {
  if (device.current)
    return { text: 'Consultation seulement', badge: 'Cet appareil' } as const;
  if (device.type === 'web') return { text: 'Consultation seulement' } as const;
  if (inSession)
    return {
      text: 'Dans la session en cours',
      badge: 'Actif',
      variant: 'secondary',
    } as const;
  return { text: 'Disponible · prêt à capturer', badge: 'Disponible' } as const;
}

/** Appareils connectés au compte et leur rôle dans la session ouverte. */
export function HomeDevices({
  devices,
  inSession,
}: {
  devices: HomeDevice[];
  inSession: Set<string>;
}) {
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
        {devices.map((device, index) => {
          const s = state(device, inSession.has(device.id));
          return (
            <Fragment key={device.id}>
              {index > 0 && <Separator />}
              <div className="flex items-center gap-4 py-3">
                <DeviceTile type={device.type} />
                <div className="grid min-w-0 flex-1 gap-1 text-sm">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {device.current ? 'Ce navigateur' : device.name}
                    {'badge' in s && (
                      <Badge variant={'variant' in s ? s.variant : 'outline'}>
                        {s.badge}
                      </Badge>
                    )}
                  </p>
                  <p className="text-muted-foreground">{s.text}</p>
                </div>
              </div>
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
}

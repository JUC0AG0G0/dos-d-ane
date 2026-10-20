import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import type { SessionDetail, SessionDevice } from '../../types/sessions.types';
import { formatTime, plural } from '../../utils';
import { DeviceTile } from '../DeviceTile';

/** Appareils de la session en cours ou en pause, avec Retirer sur les actifs. */
export function SessionDevicesCard({
  session,
  busy,
  onRemove,
}: {
  session: SessionDetail;
  busy: boolean;
  onRemove: (device: SessionDevice) => void;
}) {
  const paused = session.status === 'paused';
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appareils de la session</CardTitle>
      </CardHeader>
      <CardContent>
        {session.devices.map((device, index) => {
          const active = !device.leftAt;
          return (
            <div key={device.id}>
              {index > 0 && <Separator />}
              <div
                className={cn(
                  'flex items-center gap-4 py-3',
                  !active && 'opacity-60',
                )}
              >
                <DeviceTile type={device.type} />
                <div className="grid min-w-0 flex-1 gap-1 text-sm">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {device.name}
                    {active ? (
                      <Badge variant={paused ? 'warning' : 'default'}>
                        {paused ? 'En pause' : 'Actif'}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Retiré</Badge>
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {[
                      `Ajouté à ${formatTime(device.joinedAt)}`,
                      // Un Raspberry Pi n'envoie jamais de captures (état en direct).
                      device.type !== 'raspberry' &&
                        plural(device.captureCount, 'capture'),
                      device.lastCaptureAt &&
                        `dernière à ${formatTime(device.lastCaptureAt)}`,
                      device.leftAt && `retiré à ${formatTime(device.leftAt)}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                {active && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => onRemove(device)}
                  >
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

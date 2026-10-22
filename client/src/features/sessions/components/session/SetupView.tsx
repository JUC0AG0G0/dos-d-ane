import { Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadState } from '@/components/LoadState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApi } from '@/hooks/useApi';
import { usePolling } from '@/hooks/usePolling';
import { formatDateTime } from '@/utils/format';
import { piState } from '@/utils/raspberry';
import { useAction } from '../../hooks/useAction';
import { sessionsService } from '../../services/sessions.service';
import type { Device, SessionDetail } from '../../types/sessions.types';
import { DeviceTile } from '../DeviceTile';
import { SessionStatusBadge } from '../SessionStatusBadge';
import { SessionHeader } from './SessionHeader';
import { NoCaptureAlert, PrivacyAlert } from './SessionAlerts';

/** Raison pour laquelle un appareil ne peut pas être coché, ou null. */
function blockedReason(device: Device, sessionId: string) {
  if (!device.captureEligible)
    return { label: 'Ce navigateur', hint: 'Ne peut pas capturer' };
  const pi = piState(device);
  if (pi && !pi.usable) return pi;
  if (device.openSessionId && device.openSessionId !== sessionId)
    return { label: 'En capture dans une autre session', hint: null };
  return null;
}

/** Nouvelle session (en préparation) : choix des appareils puis lancement. */
export function SetupView({
  session,
  onChange,
}: {
  session: SessionDetail;
  onChange: (session: SessionDetail) => void;
}) {
  const navigate = useNavigate();
  const { run, busy } = useAction();
  const [pending, setPending] = useState<string | null>(null);
  const devices = useApi(
    sessionsService.devices,
    [],
    'Impossible de charger vos appareils.',
  );
  // Un Pi qui s'allume ou se coupe change d'état sans recharger la page.
  usePolling(devices.reload, 15_000);
  const selected = new Set(
    session.devices.filter((d) => !d.leftAt).map((d) => d.id),
  );
  // Appareils de capture, puis ce navigateur (grisé).
  const shown = devices.data
    ? [
        ...devices.data.filter((d) => d.captureEligible),
        ...devices.data.filter((d) => d.current && !d.captureEligible),
      ]
    : null;

  const toggle = async (device: Device, checked: boolean) => {
    setPending(device.id);
    const updated = await run(() =>
      checked
        ? sessionsService.addDevice(session.id, device.id)
        : sessionsService.removeDevice(session.id, device.id),
    );
    setPending(null);
    if (updated) onChange(updated);
    devices.reload();
  };

  const launch = async () => {
    const updated = await run(
      () => sessionsService.start(session.id),
      'Impossible de lancer la session.',
    );
    if (updated) onChange(updated);
  };

  const remove = async () => {
    const done = await run(
      () => sessionsService.remove(session.id).then(() => true),
      'Impossible de supprimer la préparation.',
    );
    if (done) navigate('/sessions');
  };

  return (
    <section className="grid gap-6">
      <SessionHeader title="Nouvelle session" status="setup" />
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appareils de capture</CardTitle>
              <CardDescription>
                Cochez les appareils qui analyseront votre posture pendant cette
                session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!shown ? (
                <LoadState error={devices.error} className="h-32" />
              ) : (
                shown.map((device, index) => {
                  const blocked = blockedReason(device, session.id);
                  const checked = selected.has(device.id);
                  const pi = piState(device);
                  const inputId = `device-${device.id}`;
                  return (
                    <div key={device.id}>
                      {index > 0 && <Separator />}
                      <label
                        htmlFor={inputId}
                        className={
                          blocked
                            ? 'flex items-center gap-4 py-3 opacity-60'
                            : 'flex cursor-pointer items-center gap-4 py-3'
                        }
                      >
                        <Checkbox
                          id={inputId}
                          checked={checked}
                          // Déjà coché puis coupé ou révoqué : on peut encore le retirer.
                          disabled={
                            (!!blocked && !checked) || pending === device.id
                          }
                          onCheckedChange={(value) =>
                            toggle(device, value === true)
                          }
                        />
                        <DeviceTile type={device.type} />
                        <div className="grid min-w-0 flex-1 gap-1 text-sm">
                          <p className="flex flex-wrap items-center gap-2 font-medium">
                            {device.name}
                            {blocked ? (
                              <Badge variant="outline">{blocked.label}</Badge>
                            ) : (
                              <Badge variant={pi?.variant ?? 'secondary'}>
                                {pi?.label ?? 'Disponible'}
                              </Badge>
                            )}
                          </p>
                          {(blocked?.hint ?? device.model) && (
                            <p className="text-muted-foreground">
                              {blocked?.hint ?? device.model}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
          <NoCaptureAlert />
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Statut</span>
                <SessionStatusBadge status="setup" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Appareils</span>
                <span>
                  {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Créée le</span>
                <span>{formatDateTime(session.createdAt)}</span>
              </div>
              <Separator className="my-1" />
              {selected.size === 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* Un bouton désactivé ne reçoit pas le survol. */}
                    <span tabIndex={0} className="grid">
                      <Button disabled>
                        <Play />
                        Lancer la session
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Choisissez au moins un appareil
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button onClick={launch} disabled={busy}>
                  <Play />
                  Lancer la session
                </Button>
              )}
              <Button variant="ghost" onClick={remove} disabled={busy}>
                <Trash2 />
                Supprimer la préparation
              </Button>
            </CardContent>
          </Card>
          <PrivacyAlert />
        </div>
      </div>
    </section>
  );
}

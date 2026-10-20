import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/utils/cn';
import { useAction } from '../../hooks/useAction';
import { sessionsService } from '../../services/sessions.service';
import type { SessionDetail } from '../../types/sessions.types';
import { formatTime } from '../../utils';
import { DeviceTile } from '../DeviceTile';

/**
 * Ajouter un appareil à une session en cours ou en pause : appareils de
 * capture qui n'y sont pas actifs ; un appareil retiré peut revenir.
 */
export function AddDeviceDialog({
  session,
  open,
  onClose,
  onChange,
}: {
  session: SessionDetail;
  open: boolean;
  onClose: () => void;
  onChange: (session: SessionDetail) => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const { run, busy } = useAction();
  const devices = useApi(
    () => (open ? sessionsService.devices() : Promise.resolve(null)),
    [open],
  );
  const others = useApi(
    () => (open ? sessionsService.list('open') : Promise.resolve(null)),
    [open],
  );
  const inSession = new Map(session.devices.map((d) => [d.id, d]));
  const candidates =
    devices.data?.filter(
      (d) =>
        d.captureEligible &&
        !(inSession.get(d.id) && !inSession.get(d.id)!.leftAt),
    ) ?? null;

  const otherSession = (id: string) => {
    const other = others.data?.find((s) => s.id === id);
    return other?.startedAt
      ? `Dans la session de ${formatTime(other.startedAt)}`
      : 'Dans une autre session';
  };

  const close = () => {
    setChecked(new Set());
    onClose();
  };

  const add = async () => {
    let updated: SessionDetail | undefined;
    for (const id of checked) {
      updated =
        (await run(() => sessionsService.addDevice(session.id, id))) ?? updated;
    }
    if (updated) onChange(updated);
    close();
  };

  const toggle = (id: string, value: boolean) =>
    setChecked((current) => {
      const next = new Set(current);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <Dialog open={open} onOpenChange={(value) => !value && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un appareil</DialogTitle>
          <DialogDescription>
            Il enverra ses captures dans cette session
            {session.status === 'paused' ? ' dès la reprise' : ''}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1">
          {!candidates ? (
            <Skeleton className="h-24" />
          ) : candidates.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              Tous vos appareils de capture sont déjà dans la session.
            </p>
          ) : (
            candidates.map((device) => {
              const removed = inSession.get(device.id)?.leftAt;
              const busyElsewhere =
                device.openSessionId && device.openSessionId !== session.id;
              const disabled = !!busyElsewhere;
              const inputId = `add-${device.id}`;
              return (
                <label
                  key={device.id}
                  htmlFor={inputId}
                  className={cn(
                    'flex items-center gap-4 rounded-lg px-2 py-2',
                    disabled ? 'opacity-60' : 'cursor-pointer hover:bg-accent',
                  )}
                >
                  <Checkbox
                    id={inputId}
                    checked={checked.has(device.id)}
                    disabled={disabled}
                    onCheckedChange={(value) =>
                      toggle(device.id, value === true)
                    }
                  />
                  <DeviceTile type={device.type} />
                  <div className="grid min-w-0 flex-1 gap-1 text-sm">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {device.name}
                      {busyElsewhere && (
                        <Badge variant="outline">
                          {otherSession(device.openSessionId!)}
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {removed
                        ? `Retiré à ${formatTime(removed)} · peut revenir dans la session`
                        : (device.model ?? 'Prêt à capturer')}
                    </p>
                  </div>
                </label>
              );
            })
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Annuler
          </Button>
          <Button onClick={add} disabled={checked.size === 0 || busy}>
            Ajouter {checked.size || ''} appareil{checked.size > 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

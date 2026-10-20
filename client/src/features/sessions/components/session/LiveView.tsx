import {
  Camera,
  CirclePause,
  Clock,
  Pause,
  Play,
  Plus,
  Smartphone,
  Square,
  Timer,
  WifiOff,
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNow } from '@/hooks/useNow';
import { usePolling } from '@/hooks/usePolling';
import { useAction } from '../../hooks/useAction';
import { useLiveSession } from '../../hooks/useLiveSession';
import { sessionsService } from '../../services/sessions.service';
import type { SessionDetail, SessionDevice } from '../../types/sessions.types';
import {
  activeSeconds,
  formatAgo,
  formatClock,
  formatDay,
  formatTime,
  plural,
  silentDevices,
} from '../../utils';
import { StatTile } from '../StatTile';
import { AddDeviceDialog } from './AddDeviceDialog';
import { CapturePreview } from './CapturePreview';
import { LiveStateCard } from './LiveStateCard';
import { PausesCard } from './PausesCard';
import { SessionDevicesCard } from './SessionDevicesCard';
import { SessionHeader } from './SessionHeader';

function keptCaptures(count: number) {
  if (count === 0) return 'Aucune capture n’a été reçue.';
  if (count === 1) return 'La capture déjà reçue est conservée.';
  return `Les ${plural(count, 'capture')} déjà reçues sont conservées.`;
}

/** Session en cours ou en pause. */
export function LiveView({
  session,
  onChange,
  reload,
}: {
  session: SessionDetail;
  onChange: (session: SessionDetail) => void;
  reload: () => void;
}) {
  const paused = session.status === 'paused';
  const now = useNow();
  const { run, busy } = useAction();
  const [adding, setAdding] = useState(false);
  const [stopping, setStopping] = useState(false);
  usePolling(reload, paused ? 15_000 : 5_000);
  // Les Raspberry Pi n'envoient pas de captures : leur état arrive en direct.
  const piDevices = session.devices.filter(
    (d) => !d.leftAt && d.type === 'raspberry',
  );
  const live = useLiveSession(session.id, piDevices.length > 0);

  const act = async (action: () => Promise<SessionDetail>) => {
    const updated = await run(action);
    if (updated) onChange(updated);
  };
  const removeDevice = (device: SessionDevice) =>
    act(() => sessionsService.removeDevice(session.id, device.id));

  const active = session.devices.filter((d) => !d.leftAt);
  const removed = session.devices.length - active.length;
  const seconds = activeSeconds(session, now);
  const deviceName = (id: string) =>
    session.devices.find((d) => d.id === id)?.name ?? 'Appareil retiré';
  const started = `Démarrée le ${formatDay(session.startedAt!)} à ${formatTime(session.startedAt!)}`;
  const silent = silentDevices(session, now);

  return (
    <section className="grid gap-6">
      <SessionHeader
        title={paused ? 'Session en pause' : 'Session en cours'}
        status={session.status}
        description={
          paused
            ? `${started} · en pause depuis ${formatTime(session.pausedSince!)}`
            : started
        }
        actions={
          <>
            <Button variant="outline" onClick={() => setAdding(true)}>
              <Plus />
              Ajouter un appareil
            </Button>
            {paused ? (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => act(() => sessionsService.resume(session.id))}
              >
                <Play />
                Reprendre
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => act(() => sessionsService.pause(session.id))}
              >
                <Pause />
                Mettre en pause
              </Button>
            )}
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => setStopping(true)}
            >
              <Square />
              Arrêter la session
            </Button>
          </>
        }
      />

      {paused && (
        <Alert variant="warning">
          <CirclePause />
          <AlertTitle>
            La session est en pause depuis {formatTime(session.pausedSince!)}
          </AlertTitle>
          <AlertDescription>
            Vos appareils n’envoient plus de captures. Le temps de pause n’est
            pas compté dans la durée.
          </AlertDescription>
        </Alert>
      )}

      {silent.map((device) => (
        <Alert key={device.id} variant="warning">
          <WifiOff />
          <AlertTitle>
            {device.name} n’envoie plus rien depuis 5 minutes
          </AlertTitle>
          <AlertDescription>
            Vérifiez que l’application est ouverte, que la capture est activée
            et que l’appareil est connecté à internet.
          </AlertDescription>
        </Alert>
      ))}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Timer}
          label="Durée active"
          value={formatClock(seconds)}
          detail={
            paused
              ? 'figée pendant la pause'
              : `depuis ${formatTime(session.startedAt!)}`
          }
        />
        {paused && (
          <StatTile
            icon={Clock}
            label="En pause"
            value={formatClock((now - Date.parse(session.pausedSince!)) / 1000)}
            detail={`depuis ${formatTime(session.pausedSince!)}`}
          />
        )}
        <StatTile
          icon={Camera}
          label="Captures"
          value={session.captureCount.toLocaleString('fr-FR')}
          detail={
            paused
              ? 'aucune pendant la pause'
              : seconds >= 60
                ? `${(session.captureCount / (seconds / 60)).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} par minute en moyenne`
                : 'moins d’une minute de session'
          }
        />
        <StatTile
          icon={Smartphone}
          label="Appareils"
          value={
            paused
              ? `${active.length} en pause`
              : `${active.length} actif${active.length > 1 ? 's' : ''}`
          }
          detail={
            removed
              ? `${removed} retiré${removed > 1 ? 's' : ''}`
              : 'aucun retiré'
          }
        />
        {!paused && (
          <StatTile
            icon={Clock}
            label="Dernière capture"
            value={
              session.lastCapture
                ? formatAgo(session.lastCapture.capturedAt, now)
                : 'en attente'
            }
            detail={
              session.lastCapture
                ? deviceName(session.lastCapture.deviceId)
                : 'aucune capture reçue'
            }
          />
        )}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_400px]">
        <div className="grid gap-6">
          <SessionDevicesCard
            session={session}
            busy={busy}
            onRemove={removeDevice}
          />
          <PausesCard pauses={session.pauses} now={now} />
        </div>
        <div className="grid gap-6">
          {piDevices.length > 0 && (
            <LiveStateCard
              devices={piDevices}
              states={live.states}
              paused={paused}
              connected={live.connected}
              now={now}
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle>Dernière capture</CardTitle>
              <CardDescription>
                {session.lastCapture
                  ? `${formatTime(session.lastCapture.capturedAt)} · ${deviceName(session.lastCapture.deviceId)}`
                  : paused
                    ? 'Aucune capture reçue avant la pause'
                    : 'En attente de la première capture'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session.lastCapture ? (
                <CapturePreview captureId={session.lastCapture.id} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Le squelette de la dernière capture s’affichera ici.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddDeviceDialog
        session={session}
        open={adding}
        onClose={() => setAdding(false)}
        onChange={onChange}
      />
      <ConfirmDialog
        open={stopping}
        title="Arrêter la session ?"
        description={`Elle ne pourra pas être relancée. ${keptCaptures(session.captureCount)}`}
        confirmLabel="Arrêter la session"
        onConfirm={() => {
          setStopping(false);
          act(() => sessionsService.stop(session.id));
        }}
        onClose={() => setStopping(false)}
      />
    </section>
  );
}

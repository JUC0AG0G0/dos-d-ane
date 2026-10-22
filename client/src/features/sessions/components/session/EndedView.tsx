import { Camera, Flag, Gauge, Play, Timer, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { useAction } from '../../hooks/useAction';
import { sessionsService } from '../../services/sessions.service';
import type { CaptureSummary, SessionDetail } from '../../types/sessions.types';
import {
  formatCount,
  formatDay,
  formatDuration,
  formatTime,
  formatTimeSeconds,
  isSingleCapture,
  mergeAlerts,
  plural,
  postureTotals,
  sessionTitle,
} from '../../utils';
import { StatTile } from '../StatTile';
import { AlertsCard } from './AlertsCard';
import { CapturePreview } from './CapturePreview';
import { CapturesCard } from './CapturesCard';
import { PostureSummaryCard } from './PostureSummaryCard';
import { ScoreTimelineCard } from './ScoreTimelineCard';
import { SessionHeader } from './SessionHeader';
import { TimelineCard } from './TimelineCard';

/** Détail d'une session terminée (ou d'une capture seule). */
export function EndedView({ session }: { session: SessionDetail }) {
  const navigate = useNavigate();
  const { run, busy } = useAction();
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<CaptureSummary | null>(null);
  const single = isSingleCapture(session);
  const title = sessionTitle(session);
  const startedAt = session.startedAt!;
  const endedAt = session.endedAt!;
  const names = new Map(session.devices.map((d) => [d.id, d.name]));
  // Un Raspberry Pi n'envoie pas de captures : ses alertes et ses résumés.
  const hasPi = session.devices.some((d) => d.type === 'raspberry');
  const onlyPi = hasPi && session.devices.every((d) => d.type === 'raspberry');
  const summaries = useApi(
    () => (hasPi ? sessionsService.summaries(session.id) : Promise.resolve([])),
    [session.id, hasPi],
    'Impossible de charger les bilans.',
  );
  const events = useApi(
    () => (hasPi ? sessionsService.events(session.id) : Promise.resolve([])),
    [session.id, hasPi],
    'Impossible de charger les alertes.',
  );
  const alerts = mergeAlerts(events.data ?? [], []);
  const score = postureTotals(summaries.data ?? []).score;

  const remove = async () => {
    setDeleting(false);
    const done = await run(
      () => sessionsService.remove(session.id).then(() => true),
      'Impossible de supprimer la session.',
    );
    if (done) {
      toast.success(`${title} supprimée`);
      navigate('/sessions');
    }
  };

  const captureWord = session.captureCount > 1 ? 'Ses' : 'Sa';

  return (
    <section className="grid gap-6">
      <SessionHeader
        title={title}
        status="ended"
        description={[
          single
            ? `À ${formatTime(startedAt)}`
            : `De ${formatTime(startedAt)} à ${formatTime(endedAt)}`,
          session.devices.map((d) => d.name).join(', '),
        ]
          .filter(Boolean)
          .join(' · ')}
        actions={
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setDeleting(true)}
          >
            <Trash2 />
            {single ? 'Supprimer la capture' : 'Supprimer la session'}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Play}
          label="Début"
          value={formatTime(startedAt)}
          detail={formatDay(startedAt)}
        />
        <StatTile
          icon={Flag}
          label="Fin"
          value={formatTime(endedAt)}
          detail={formatDay(endedAt)}
        />
        <StatTile
          icon={Timer}
          label="Durée active"
          value={single ? '—' : formatDuration(session.durationSeconds ?? 0)}
          detail={
            session.pausedSeconds >= 60
              ? `dont ${formatDuration(session.pausedSeconds)} de pause`
              : undefined
          }
        />
        {onlyPi ? (
          <StatTile
            icon={Gauge}
            label="Score"
            value={!summaries.data ? '…' : score === null ? '—' : `${score} %`}
            detail={
              events.data
                ? `du temps en bonne posture · ${plural(alerts.length, 'alerte')}`
                : 'du temps en bonne posture'
            }
          />
        ) : (
          <StatTile
            icon={Camera}
            label="Captures"
            value={formatCount(session.captureCount)}
            detail={plural(session.devices.length, 'appareil')}
          />
        )}
      </div>

      {hasPi && (
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_400px]">
          <div className="grid gap-6">
            <ScoreTimelineCard
              summaries={summaries.data}
              devices={session.devices}
              error={summaries.error}
            />
            <AlertsCard
              alerts={alerts}
              devices={session.devices}
              error={events.error}
            />
          </div>
          <PostureSummaryCard
            summaries={summaries.data}
            error={summaries.error}
            live={false}
          />
        </div>
      )}

      {!single && !onlyPi && (
        <TimelineCard sessionId={session.id} endedAt={endedAt} />
      )}

      {!onlyPi && (
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_400px]">
          <CapturesCard
            session={session}
            selected={selected}
            onSelect={setSelected}
          />
          <Card>
            <CardHeader>
              <CardTitle>
                Aperçu
                {selected && ` · ${formatTimeSeconds(selected.capturedAt)}`}
              </CardTitle>
              <CardDescription>
                Positions des articulations seulement : l’image n’est jamais
                stockée.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selected ? (
                <CapturePreview
                  captureId={selected.id}
                  details={(size) =>
                    `${names.get(selected.deviceId) ?? 'Appareil supprimé'} · ${size}`
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune capture à afficher.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={deleting}
        title={`Supprimer la ${single ? 'capture' : 'session'} du ${formatDay(startedAt)} ?`}
        description={`${
          onlyPi
            ? 'Ses alertes et ses bilans seront effacés définitivement.'
            : session.captureCount === 0
              ? 'Elle ne contient aucune capture.'
              : `${captureWord} ${plural(session.captureCount, 'capture')} ${
                  session.captureCount > 1 ? 'seront effacées' : 'sera effacée'
                } définitivement.`
        } Cette action ne peut pas être annulée.`}
        confirmLabel="Supprimer"
        onConfirm={remove}
        onClose={() => setDeleting(false)}
      />
    </section>
  );
}

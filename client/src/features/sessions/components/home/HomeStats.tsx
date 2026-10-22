import {
  Calendar,
  Camera,
  Smartphone,
  Timer,
  TriangleAlert,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Device, SessionStats } from '../../types/sessions.types';
import { compareWeeks, formatCount, formatDuration } from '../../utils';
import { StatTile } from '../StatTile';

/** Chiffres de la semaine (depuis lundi, heure de Paris) et appareils. */
export function HomeStats({
  stats,
  devices,
  liveSessionIds,
}: {
  stats: SessionStats | null;
  devices: Device[] | null;
  liveSessionIds: Set<string>;
}) {
  if (!stats || !devices) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }
  // Un Pi sans clé (révoquée, en attente) ne peut pas capturer : pas compté.
  const capturing = devices.filter(
    (d) =>
      d.captureEligible && (d.type !== 'raspberry' || d.keyStatus === 'active'),
  );
  const inSession = capturing.filter(
    (d) => d.openSessionId && liveSessionIds.has(d.openSessionId),
  ).length;
  // Un Pi n'envoie jamais de captures : ses alertes plutôt que « 0 capture ».
  const showAlerts =
    capturing.some((d) => d.type === 'raspberry') &&
    stats.thisWeek.captures === 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={Calendar}
        label="Sessions cette semaine"
        value={formatCount(stats.thisWeek.sessions)}
        detail={compareWeeks(stats.thisWeek.sessions, stats.lastWeek.sessions)}
      />
      <StatTile
        icon={Timer}
        label="Temps analysé"
        value={
          stats.thisWeek.durationSeconds
            ? formatDuration(stats.thisWeek.durationSeconds)
            : '0 min'
        }
        detail="cette semaine"
      />
      {showAlerts ? (
        <StatTile
          icon={TriangleAlert}
          label="Alertes"
          value={formatCount(stats.thisWeek.alerts)}
          detail="cette semaine"
        />
      ) : (
        <StatTile
          icon={Camera}
          label="Captures"
          value={formatCount(stats.thisWeek.captures)}
          detail="cette semaine"
        />
      )}
      <StatTile
        icon={Smartphone}
        label="Appareils"
        value={formatCount(capturing.length)}
        detail={
          inSession
            ? `${inSession} dans des sessions en cours`
            : 'aucun en session'
        }
      />
    </div>
  );
}

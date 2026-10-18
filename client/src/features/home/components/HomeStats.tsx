import {
  Calendar,
  Camera,
  Smartphone,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { AnalysisSessionSummary } from '@/features/analysis';
import { compareWeeks, formatCount, formatHours, startOfWeek } from '../utils';

const WEEK = 7 * 24 * 60 * 60 * 1000;

function Stat({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="gap-2 px-5 py-4">
      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </Card>
  );
}

/** Chiffres de la semaine en cours (depuis lundi). */
export function HomeStats({
  sessions,
  deviceCount,
  inSession,
}: {
  sessions: AnalysisSessionSummary[];
  deviceCount: number | null;
  inSession: number | null;
}) {
  const weekStart = startOfWeek();
  const started = (s: AnalysisSessionSummary) =>
    s.startedAt ? Date.parse(s.startedAt) : null;
  const thisWeek = sessions.filter((s) => (started(s) ?? 0) >= weekStart);
  const lastWeek = sessions.filter((s) => {
    const at = started(s);
    return at !== null && at >= weekStart - WEEK && at < weekStart;
  });
  const seconds = thisWeek.reduce(
    (sum, s) => sum + (s.durationSeconds ?? 0),
    0,
  );
  const captures = thisWeek.reduce((sum, s) => sum + s.captureCount, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat
        icon={Calendar}
        label="Sessions cette semaine"
        value={formatCount(thisWeek.length)}
        detail={compareWeeks(thisWeek.length, lastWeek.length)}
      />
      <Stat
        icon={Timer}
        label="Temps analysé"
        value={formatHours(seconds, true)}
        detail="cette semaine"
      />
      <Stat
        icon={Camera}
        label="Captures"
        value={formatCount(captures)}
        detail="cette semaine"
      />
      <Stat
        icon={Smartphone}
        label="Appareils"
        value={deviceCount === null ? '—' : formatCount(deviceCount)}
        detail={
          inSession === null
            ? 'aucun en session'
            : `${inSession} dans la session en cours`
        }
      />
    </div>
  );
}

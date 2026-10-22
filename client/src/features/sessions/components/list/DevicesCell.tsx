import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import type { SessionSummary } from '../../types/sessions.types';
import { Monitor } from 'lucide-react';
import { DEVICE_ICONS, deviceResult, formatTime, plural } from '../../utils';

/**
 * Cellule Appareils : le nom s'il n'y en a qu'un, « — » sans appareil, sinon
 * « n appareils » avec la liste au survol (ou au focus).
 */
export function DevicesCell({ session }: { session: SessionSummary }) {
  const { devices } = session;
  if (devices.length === 0) return <>—</>;
  if (devices.length === 1) return <>{devices[0].name}</>;

  // Après l'arrêt, tous les appareils ont la date de fin : seul un retrait
  // avant la fin est affiché.
  const removedAt = (leftAt: string | null) =>
    leftAt && leftAt !== session.endedAt ? leftAt : null;

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="underline decoration-dotted underline-offset-4"
        >
          {plural(devices.length, 'appareil')}
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="grid gap-3">
        <p className="text-sm font-medium">
          {plural(devices.length, 'appareil')} dans cette session
        </p>
        <ul className="grid gap-2">
          {devices.map((device) => {
            const Icon = DEVICE_ICONS[device.type] ?? Monitor;
            const removed = removedAt(device.leftAt);
            return (
              <li key={device.id} className="flex items-center gap-3 text-sm">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{device.name}</span>
                <span className="text-muted-foreground">
                  {removed
                    ? `retiré à ${formatTime(removed)}`
                    : deviceResult(device)}
                </span>
              </li>
            );
          })}
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}

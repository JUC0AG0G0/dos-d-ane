import { Monitor, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { DEVICE_ICONS } from '../utils';

/** Pastille carrée avec l'icône d'un type d'appareil (ou une icône donnée). */
export function DeviceTile({
  type,
  icon,
  className,
}: {
  type?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  const Icon = icon ?? DEVICE_ICONS[type ?? ''] ?? Monitor;
  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground',
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}

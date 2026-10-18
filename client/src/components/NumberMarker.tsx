import { cn } from '@/utils/cn';

/** Pastille numérotée (repère du schéma, étape d'un exercice). */
export function NumberMarker({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground',
        className,
      )}
    >
      {value}
    </span>
  );
}

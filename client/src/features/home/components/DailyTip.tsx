import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePostureTips } from '@/features/advice';
import { dayIndex } from '../utils';

/** Un réglage de « Bien s’installer », différent chaque jour. */
export function DailyTip() {
  const { data: tips } = usePostureTips();
  if (!tips?.length) return null;
  const tip = tips[dayIndex(tips.length)];

  return (
    <Link
      to="/conseils/installation"
      className="flex gap-4 rounded-xl border bg-accent px-5 py-4 text-accent-foreground transition-colors hover:border-primary"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
        <Leaf className="size-5" />
      </span>
      <div className="grid gap-1">
        <p className="text-xs font-medium">Conseil du jour</p>
        <p className="font-semibold">{tip.title}</p>
        <p className="text-sm">{tip.shortText}</p>
      </div>
    </Link>
  );
}

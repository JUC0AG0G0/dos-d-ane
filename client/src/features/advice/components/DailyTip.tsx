import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePostureTips } from '../hooks/useAdvice';

const DAY = 24 * 60 * 60 * 1000;

/** Jour de l'année (0 le 1er janvier). */
function dayOfYear(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round(
    (today.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / DAY,
  );
}

/** Conseil du jour : un réglage de « Bien s’installer », choisi par le jour de l'année. */
export function DailyTip() {
  const { data: tips } = usePostureTips();
  if (!tips?.length) return null;
  const tip = tips[dayOfYear() % tips.length];

  return (
    <div className="flex gap-4 rounded-xl border bg-accent px-5 py-4 text-accent-foreground">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
        <Leaf className="size-5" />
      </span>
      <div className="grid gap-1">
        <p className="text-xs font-medium">Conseil du jour</p>
        <p className="font-semibold">{tip.title}</p>
        <p className="text-sm">{tip.shortText}</p>
        <Link
          to="/conseils/installation"
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Bien s’installer
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

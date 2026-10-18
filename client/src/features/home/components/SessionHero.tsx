import { Activity, ArrowRight, CircleCheck, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type {
  AnalysisSessionDetail,
  AnalysisSessionSummary,
} from '@/features/analysis';
import { cn } from '@/utils/cn';
import { formatAgo, formatCount, formatDay, formatTime } from '../utils';

const NO_CAPTURE =
  'Le navigateur ne capture pas : la caméra est sur vos autres appareils.';

function plural(count: number, word: string) {
  return `${formatCount(count)} ${word}${count > 1 ? 's' : ''}`;
}

/** Grand encart du haut : session ouverte, ou invitation à en lancer une. */
export function SessionHero({
  open,
  detail,
  last,
}: {
  open: AnalysisSessionSummary | null;
  detail: AnalysisSessionDetail | null;
  last: AnalysisSessionSummary | null;
}) {
  if (!open) {
    return (
      <div className="grid justify-items-start gap-3 rounded-xl border border-dashed bg-card px-7 py-6 shadow-sm">
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <CircleCheck className="size-4" />
          Aucune session en cours
        </p>
        <h2 className="text-2xl font-semibold">
          Prêt pour une nouvelle analyse ?
        </h2>
        <p className="text-sm text-muted-foreground">
          {last?.endedAt
            ? `Dernière session terminée ${formatDay(last.endedAt)}. `
            : 'Vous n’avez pas encore de session. '}
          Lancez-en une puis ouvrez l’application sur votre téléphone ou votre
          Raspberry : le navigateur ne capture pas.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/sessions/nouvelle">
              <Play />
              Démarrer une session
            </Link>
          </Button>
          {last && (
            <Button variant="outline" asChild>
              <Link to={`/sessions/${last.id}`}>
                Voir la dernière session
                <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const running = open.status === 'running';
  const active =
    detail?.devices.filter((d) => !d.leftAt).length ?? open.deviceCount;
  const lastCapture = detail?.captures.at(-1);

  let title: string;
  let description: string;
  if (running) {
    title =
      active > 1
        ? `${active} appareils analysent votre posture`
        : active === 1
          ? 'Un appareil analyse votre posture'
          : 'Aucun appareil n’analyse votre posture';
    description = [
      `Démarrée à ${formatTime(open.startedAt!)}`,
      plural(open.captureCount, 'capture'),
      lastCapture && `dernière ${formatAgo(lastCapture.capturedAt)}`,
    ]
      .filter(Boolean)
      .join(' · ');
  } else {
    title = active
      ? `${plural(active, 'appareil')} ${active > 1 ? 'prêts' : 'prêt'} à capturer`
      : 'Ajoutez un appareil pour commencer';
    description = `Créée à ${formatTime(open.createdAt)}. Lancez-la quand vos appareils sont en place`;
  }

  return (
    <div className="grid justify-items-start gap-3 rounded-xl bg-primary px-7 py-6 text-primary-foreground shadow-sm">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Activity className={cn('size-4', running && 'animate-pulse')} />
        {running ? 'Session en cours' : 'Session en préparation'}
      </p>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm">
        {description}. {NO_CAPTURE}
      </p>
      <Button variant="secondary" className="mt-2" asChild>
        <Link to={`/sessions/${open.id}`}>
          Voir la session
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}

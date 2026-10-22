import { Activity, ArrowRight, CircleCheck, Pause, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNow } from '@/hooks/useNow';
import { useNewSession } from '../../hooks/useNewSession';
import type { SessionSummary } from '../../types/sessions.types';
import {
  formatAgo,
  formatRelative,
  formatTime,
  plural,
  sessionResult,
} from '../../utils';

const NO_CAPTURE =
  'Le navigateur ne capture pas : ce sont vos appareils (téléphone, ordinateur, Raspberry) qui analysent votre posture.';

/** Au-delà, les sessions suivantes sont résumées par « et n autres ». */
const MAX_LISTED = 3;

const activeDevices = (session: SessionSummary) =>
  session.devices.filter((d) => !d.leftAt).length;

function analysing(count: number) {
  if (count === 0) return 'Aucun appareil n’analyse votre posture';
  return count === 1
    ? 'Un appareil analyse votre posture'
    : `${count} appareils analysent votre posture`;
}

function GreenBanner({ children }: { children: ReactNode }) {
  return (
    <div className="grid justify-items-start gap-3 rounded-xl bg-primary px-7 py-6 text-primary-foreground shadow-sm">
      {children}
    </div>
  );
}

/** Une session en cours ou en pause. */
function LiveSession({ session }: { session: SessionSummary }) {
  const now = useNow();
  const paused = session.status === 'paused';
  const details = [
    `Démarrée à ${formatTime(session.startedAt!)}`,
    sessionResult(session),
    session.lastCaptureAt &&
      `dernière ${formatAgo(session.lastCaptureAt, now)}`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <GreenBanner>
      <p className="flex items-center gap-2 text-sm font-medium">
        {paused ? (
          <Pause className="size-4" />
        ) : (
          <Activity className="size-4 animate-pulse" />
        )}
        {paused ? 'Session en pause' : 'Session en cours'}
      </p>
      <h2 className="text-2xl font-semibold">
        {paused
          ? `En pause depuis ${formatTime(session.pausedSince!)}`
          : analysing(activeDevices(session))}
      </h2>
      <p className="text-sm">
        {details}. {NO_CAPTURE}
      </p>
      <Button variant="secondary" className="mt-2" asChild>
        <Link to={`/sessions/${session.id}`}>
          Voir la session
          <ArrowRight />
        </Link>
      </Button>
    </GreenBanner>
  );
}

/** Plusieurs sessions en cours ou en pause. */
function LiveSessions({ sessions }: { sessions: SessionSummary[] }) {
  const now = useNow();
  const devices = sessions
    .filter((s) => s.status === 'running')
    .reduce((sum, s) => sum + activeDevices(s), 0);
  const listed = sessions.slice(0, MAX_LISTED);
  const others = sessions.length - listed.length;

  return (
    <GreenBanner>
      <p className="flex items-center gap-2 text-sm font-medium">
        <Activity className="size-4 animate-pulse" />
        {sessions.length} sessions en cours
      </p>
      <h2 className="text-2xl font-semibold">{analysing(devices)}</h2>
      <ul className="grid w-full gap-2">
        {listed.map((session) => (
          <li
            key={session.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-primary-foreground/10 px-4 py-2 text-sm"
          >
            <span className="font-medium">
              Session de {formatTime(session.startedAt!)}
            </span>
            <span className="flex-1">
              {[
                sessionResult(session),
                plural(activeDevices(session), 'appareil'),
                session.status === 'paused'
                  ? 'en pause'
                  : session.lastCaptureAt &&
                    `dernière ${formatAgo(session.lastCaptureAt, now)}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/sessions/${session.id}`}>Voir</Link>
            </Button>
          </li>
        ))}
      </ul>
      {others > 0 && (
        <Link
          to="/sessions?statut=en-cours"
          className="text-sm font-medium underline underline-offset-4"
        >
          et {plural(others, 'autre')}
        </Link>
      )}
      <p className="text-sm">{NO_CAPTURE}</p>
    </GreenBanner>
  );
}

function DashedBanner({ children }: { children: ReactNode }) {
  return (
    <div className="grid justify-items-start gap-3 rounded-xl border border-dashed bg-card px-7 py-6 shadow-sm">
      {children}
    </div>
  );
}

function StartButton({
  setup,
  disabled,
}: {
  setup: SessionSummary | null;
  disabled?: boolean;
}) {
  const { start, busy } = useNewSession();
  if (setup) {
    return (
      <Button asChild>
        <Link to={`/sessions/${setup.id}`}>
          <Play />
          Reprendre la préparation
        </Link>
      </Button>
    );
  }
  return (
    <Button onClick={start} disabled={disabled || busy}>
      <Play />
      Démarrer une session
    </Button>
  );
}

/** Aucune session en cours : invitation à en démarrer une. */
function NoSession({
  last,
  setup,
}: {
  last: SessionSummary | null;
  setup: SessionSummary | null;
}) {
  return (
    <DashedBanner>
      <p className="flex items-center gap-2 text-sm font-medium text-primary">
        <CircleCheck className="size-4" />
        Aucune session en cours
      </p>
      <h2 className="text-2xl font-semibold">
        Prêt pour une nouvelle analyse ?
      </h2>
      <p className="text-sm text-muted-foreground">
        {last?.endedAt &&
          `Dernière session terminée ${formatRelative(last.endedAt)}. `}
        {NO_CAPTURE}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <StartButton setup={setup} />
        {last && (
          <Button variant="outline" asChild>
            <Link to={`/sessions/${last.id}`}>
              Voir la dernière session
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </DashedBanner>
  );
}

const STEPS = [
  {
    title: 'Installez l’application',
    text: 'Sur votre téléphone, votre ordinateur ou un Raspberry avec caméra.',
  },
  {
    title: 'Connectez-vous sur l’appareil',
    text: 'Avec le même compte que sur ce site.',
  },
  {
    title: 'Lancez une session',
    text: 'Choisissez vos appareils ici, puis suivez votre posture.',
  },
];

/** Première visite : aucune session et aucun appareil de capture. */
function FirstVisit() {
  return (
    <DashedBanner>
      <h2 className="text-2xl font-semibold">
        Analysez votre posture en 3 étapes
      </h2>
      <ol className="grid w-full gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {index + 1}
            </span>
            <div className="grid gap-1 text-sm">
              <p className="font-medium">{step.title}</p>
              <p className="text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex flex-wrap gap-2">
        <StartButton setup={null} disabled />
        <Button variant="outline" asChild>
          <Link to="/conseils/installation">Bien s’installer</Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        « Démarrer une session » sera disponible dès qu’un appareil pourra
        capturer.
      </p>
    </DashedBanner>
  );
}

/** Bandeau principal de l'accueil, selon les sessions et les appareils. */
export function HomeHero({
  live,
  setup,
  last,
  firstVisit,
}: {
  live: SessionSummary[];
  setup: SessionSummary | null;
  last: SessionSummary | null;
  firstVisit: boolean;
}) {
  if (live.length > 1) return <LiveSessions sessions={live} />;
  if (live.length === 1) return <LiveSession session={live[0]} />;
  if (firstVisit) return <FirstVisit />;
  return <NoSession last={last} setup={setup} />;
}

import { Play } from 'lucide-react';
import { DailyTip } from '@/features/advice';
import { ErrorAlert } from '@/components/ErrorAlert';
import { LoadState } from '@/components/LoadState';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth.store';
import { useHome } from '../../hooks/useHome';
import { useNewSession } from '../../hooks/useNewSession';
import { HomeDevices } from './HomeDevices';
import { HomeHero } from './HomeHero';
import { HomeStats } from './HomeStats';
import { RecentSessions } from './RecentSessions';

/**
 * Accueil : session en cours (ou invitation à en démarrer une), chiffres de
 * la semaine, dernières sessions, conseil du jour et appareils.
 */
export function HomeView() {
  const user = useAuthStore((s) => s.user);
  const { open, live, ended, sessionsError, stats, devices, devicesError } =
    useHome();
  const newSession = useNewSession();

  const loaded = open && ended && devices;
  const setup = open?.find((s) => s.status === 'setup') ?? null;
  const firstVisit =
    !!loaded &&
    open.length === 0 &&
    ended.length === 0 &&
    !devices.some((d) => d.captureEligible);
  const recent = [...live, ...(ended ?? [])].slice(0, 3);

  return (
    <section className="grid gap-6">
      <PageHeader
        title={user ? `Bonjour ${user.displayName}` : 'Bonjour'}
        description="Préparez et suivez vos sessions d’analyse de posture."
        actions={
          live.length > 0 && (
            <Button onClick={newSession.start} disabled={newSession.busy}>
              <Play />
              Nouvelle session
            </Button>
          )
        }
      />
      {!loaded ? (
        <LoadState error={sessionsError ?? devicesError} className="h-48" />
      ) : (
        <>
          <HomeHero
            live={live}
            setup={setup}
            last={ended[0] ?? null}
            firstVisit={firstVisit}
          />
          {!firstVisit && (
            <HomeStats
              stats={stats}
              devices={devices}
              liveSessionIds={new Set(live.map((s) => s.id))}
            />
          )}
          <div className="grid items-start gap-6 xl:grid-cols-[1fr_400px]">
            {firstVisit ? <DailyTip /> : <RecentSessions sessions={recent} />}
            <div className="grid gap-6">
              {!firstVisit && <DailyTip />}
              {devicesError ? (
                <ErrorAlert message={devicesError} />
              ) : devices ? (
                <HomeDevices
                  devices={devices}
                  openSessions={open}
                  waiting={firstVisit}
                />
              ) : (
                <Skeleton className="h-48" />
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorAlert } from '@/components/ErrorAlert';
import { LoadState } from '@/components/LoadState';
import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useHome } from '../hooks/useHome';
import { DailyTip } from './DailyTip';
import { HomeDevices } from './HomeDevices';
import { HomeStats } from './HomeStats';
import { RecentSessions } from './RecentSessions';
import { SessionHero } from './SessionHero';

/**
 * Accueil : session ouverte (ou invitation à en lancer une), chiffres de la
 * semaine, dernières sessions, conseil du jour et appareils.
 */
export function HomeView() {
  const user = useAuthStore((s) => s.user);
  const { sessions, sessionsError, open, openDetail, devices, devicesError } =
    useHome();

  const inSession = new Set(
    openDetail?.devices.filter((d) => !d.leftAt).map((d) => d.id) ?? [],
  );
  const ended = sessions?.find((s) => s.status === 'ended') ?? null;

  return (
    <section className="grid gap-6">
      <PageHeader
        title={user ? `Bonjour ${user.displayName}` : 'Bonjour'}
        description="Voici où en est votre posture aujourd’hui."
        actions={
          open && (
            <Button asChild>
              <Link to="/sessions/nouvelle">
                <Play />
                Nouvelle session
              </Link>
            </Button>
          )
        }
      />
      {!sessions ? (
        <LoadState error={sessionsError} className="h-48" />
      ) : (
        <>
          <SessionHero open={open} detail={openDetail} last={ended} />
          <HomeStats
            sessions={sessions}
            deviceCount={devices?.length ?? null}
            inSession={open ? inSession.size || open.deviceCount : null}
          />
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
            <RecentSessions sessions={sessions} />
            <div className="grid gap-6">
              <DailyTip />
              {devicesError ? (
                <ErrorAlert message={devicesError} />
              ) : devices ? (
                <HomeDevices devices={devices} inSession={inSession} />
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

import { LoadState } from '@/components/LoadState';
import { usePageCrumb } from '@/hooks/usePageCrumb';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useSession } from '../../hooks/useSession';
import { sessionTitle } from '../../utils';
import { EndedView } from './EndedView';
import { LiveView } from './LiveView';
import { SetupView } from './SetupView';

/**
 * Page d'une session : la vue suit son état (préparation, en cours ou en
 * pause, terminée) et bascule sans changer d'URL.
 */
export function SessionView({ id }: { id: string }) {
  const { session, setSession, notFound, error, reload } = useSession(id);
  usePageCrumb(session ? sessionTitle(session) : null);

  if (notFound) return <NotFoundPage />;
  if (!session) return <LoadState error={error} className="h-96" />;

  switch (session.status) {
    case 'setup':
      return <SetupView session={session} onChange={setSession} />;
    case 'running':
    case 'paused':
      return (
        <LiveView session={session} onChange={setSession} reload={reload} />
      );
    case 'ended':
      return <EndedView session={session} />;
  }
}

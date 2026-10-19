import { useNavigate } from 'react-router-dom';
import { sessionsService } from '../services/sessions.service';
import { useAction } from './useAction';

/**
 * « Nouvelle session » : reprend la préparation ouverte la plus récente s'il y
 * en a une, sinon en crée une (sans appareil), puis ouvre sa page.
 */
export function useNewSession() {
  const navigate = useNavigate();
  const { busy, run } = useAction();
  const start = async () => {
    const session = await run(async () => {
      const [setup] = await sessionsService.list('setup', 1);
      return setup ?? (await sessionsService.create());
    }, 'Impossible de créer la session.');
    if (session) navigate(`/sessions/${session.id}`);
  };
  return { start, busy };
}

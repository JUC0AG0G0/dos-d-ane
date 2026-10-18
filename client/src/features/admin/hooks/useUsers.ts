import { useApi } from '@/hooks/useApi';
import { adminService } from '../services/admin.service';

/** Liste des utilisateurs, rechargeable après un changement de rôle. */
export function useUsers() {
  const { data, loading, error, reload } = useApi(
    adminService.users,
    [],
    'Impossible de charger les utilisateurs.',
  );
  return { users: data ?? [], loading, error, reload };
}

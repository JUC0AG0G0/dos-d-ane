import { useCallback, useEffect, useState } from 'react';
import type { User } from '@/types/user';
import { adminService } from '../services/admin.service';

const LOAD_ERROR = 'Impossible de charger les utilisateurs.';

export function useUsers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setUsers(await adminService.users());
      setError(null);
    } catch {
      setError(LOAD_ERROR);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    adminService
      .users()
      .then((list) => !cancelled && setUsers(list))
      .catch(() => !cancelled && setError(LOAD_ERROR));
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    users: users ?? [],
    loading: users === null && error === null,
    error,
    reload,
  };
}

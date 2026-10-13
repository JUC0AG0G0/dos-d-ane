import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { authService } from '../services/auth.service';

export function useCurrentUser() {
  useEffect(() => {
    authService
      .me()
      .then((user) => useAuthStore.getState().setUser(user))
      .catch(() => undefined);
  }, []);
  return useAuthStore((state) => state.user);
}

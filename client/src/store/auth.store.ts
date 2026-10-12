import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse, User } from '@/types/auth';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  deviceId: string | null;
  signIn: (session: LoginResponse) => void;
  setUser: (user: User) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      deviceId: null,
      signIn: ({ accessToken, user, deviceId }) =>
        set({ accessToken, user, deviceId }),
      setUser: (user) => set({ user }),
      signOut: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'dos-d-ane.auth',
      partialize: ({ accessToken, user, deviceId }) => ({
        accessToken,
        user,
        deviceId,
      }),
    },
  ),
);

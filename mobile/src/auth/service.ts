import { http } from '@/services/http';

import type { LoginInput, LoginResponse, RegisterInput, User } from './types';

/** Routes d'authentification de l'API (mêmes que le site web). */
export const AUTH_ROUTES = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  me: '/auth/me',
} as const;

export const authService = {
  register: (input: RegisterInput) => http.post<User>(AUTH_ROUTES.register, input),
  login: (input: LoginInput) => http.post<LoginResponse>(AUTH_ROUTES.login, input),
  logout: () => http.post<void>(AUTH_ROUTES.logout),
  me: () => http.get<User>(AUTH_ROUTES.me),
};

import { http } from '@/services';
import type { User } from '@/types/user';
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
} from '../types/auth.types';
import { AUTH_ROUTES } from './auth.routes';

export const authService = {
  register: (input: RegisterInput) =>
    http.post<User>(AUTH_ROUTES.register, input),
  login: (input: LoginInput) =>
    http.post<LoginResponse>(AUTH_ROUTES.login, input),
  logout: () => http.post<void>(AUTH_ROUTES.logout),
  me: () => http.get<User>(AUTH_ROUTES.me),
};

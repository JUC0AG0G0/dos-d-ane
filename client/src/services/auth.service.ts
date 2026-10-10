import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  Session,
  User,
} from '@/types/auth';
import { http } from './http';
import { API_ROUTES } from './routes';

const { auth } = API_ROUTES;

export const authService = {
  register: (input: RegisterInput) => http.post<User>(auth.register, input),
  login: (input: LoginInput) => http.post<LoginResponse>(auth.login, input),
  logout: () => http.post<void>(auth.logout),
  me: () => http.get<User>(auth.me),
  sessions: () => http.get<Session[]>(auth.sessions),
  revokeSession: (id: string) => http.delete<void>(auth.session(id)),
  revokeOtherSessions: () => http.delete<{ revoked: number }>(auth.sessions),
};

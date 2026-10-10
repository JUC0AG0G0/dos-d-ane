import type { Health } from '@/types/health';
import { http } from './http';
import { API_ROUTES } from './routes';

export const healthService = {
  get: () => http.get<Health>(API_ROUTES.health),
};

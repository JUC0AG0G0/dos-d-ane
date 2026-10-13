import { http } from '@/services';
import type { Health } from '../types/health.types';
import { HEALTH_ROUTES } from './health.routes';

export const healthService = {
  get: () => http.get<Health>(HEALTH_ROUTES.health),
};

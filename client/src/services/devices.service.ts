import type { SessionDevice } from '@/types/auth';
import { http } from './http';
import { API_ROUTES } from './routes';

export const devicesService = {
  rename: (id: string, name: string) =>
    http.patch<SessionDevice>(API_ROUTES.devices.device(id), { name }),
};

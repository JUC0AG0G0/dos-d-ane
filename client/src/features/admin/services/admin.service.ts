import { http } from '@/services';
import type { Role } from '@/types/user';
import type { AdminUser } from '../types/admin.types';
import { ADMIN_ROUTES } from './admin.routes';

export const adminService = {
  users: () => http.get<AdminUser[]>(ADMIN_ROUTES.users),
  updateRoles: (ids: string[], role: Role) =>
    http.patch<AdminUser[]>(ADMIN_ROUTES.roles, { ids, role }),
  revealEmail: (id: string) =>
    http.get<{ email: string }>(ADMIN_ROUTES.email(id)),
};

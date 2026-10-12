import { http } from '@/services';
import type { Role, User } from '@/types/user';
import { ADMIN_ROUTES } from './admin.routes';

export const adminService = {
  users: () => http.get<User[]>(ADMIN_ROUTES.users),
  updateRoles: (ids: string[], role: Role) =>
    http.patch<User[]>(ADMIN_ROUTES.roles, { ids, role }),
};

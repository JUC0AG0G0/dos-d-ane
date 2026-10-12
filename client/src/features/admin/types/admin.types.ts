import type { Role, User } from '@/types/user';

export interface RoleChange {
  users: User[];
  role: Role;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrateur',
  user: 'Utilisateur',
};

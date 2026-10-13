import type { Role } from '@/types/user';

export interface AdminUser {
  id: string;
  maskedEmail: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface RoleChange {
  users: AdminUser[];
  role: Role;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrateur',
  user: 'Utilisateur',
};

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

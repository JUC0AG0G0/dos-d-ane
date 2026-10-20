/** Utilisateur renvoyé par l'API, aligné sur le serveur et le site web (client/src/types/user.ts). */

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

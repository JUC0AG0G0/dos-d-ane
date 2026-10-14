/** Types de l'authentification, alignés sur le serveur et le site web (client/src/features/auth). */

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export type DeviceType = 'web' | 'mobile';

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginInput {
  email: string;
  password: string;
  device?: { id?: string; type?: DeviceType };
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  sessionId: string;
  deviceId: string;
  user: User;
}

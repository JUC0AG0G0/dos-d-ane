// Réponses et corps de /api/auth (server/src/auth/dto).

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export type DeviceType = 'web' | 'mobile';

export interface SessionDevice {
  id: string;
  name: string;
  type: string;
  model: string | null;
}

export interface Session {
  id: string;
  device: SessionDevice;
  active: boolean;
  current: boolean;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  ipAddress: string | null;
  revokedAt: string | null;
}

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

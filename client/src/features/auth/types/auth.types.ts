import type { User } from '@/types/user';

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

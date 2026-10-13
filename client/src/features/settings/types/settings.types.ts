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

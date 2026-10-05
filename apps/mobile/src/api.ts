import { config } from './config';

export interface Health {
  status: string;
  env: string;
  version: string;
}

export async function fetchHealth(signal?: AbortSignal): Promise<Health> {
  const res = await fetch(`${config.apiUrl}/health`, { signal });
  if (!res.ok) {
    throw new Error(`API indisponible (${res.status})`);
  }
  return (await res.json()) as Health;
}

import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth.store';

/** Erreur HTTP renvoyée par l'API, avec son code et son corps JSON éventuel. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    const message = (body as { message?: unknown } | null)?.message;
    super(typeof message === 'string' ? message : `L'API a répondu ${status}`);
    this.status = status;
    this.body = body;
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Appelle l'API et renvoie son JSON (undefined pour une réponse vide).
 * Ajoute le jeton de session ; un 401 vide la session locale.
 */
export async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    if (response.status === 401 && token) useAuthStore.getState().signOut();
    throw new ApiError(response.status, data);
  }
  return data as T;
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

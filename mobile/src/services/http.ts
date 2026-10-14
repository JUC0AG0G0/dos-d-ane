import { env } from '@/config/env';
import { jetonActuel, signalerSessionExpiree } from '@/auth/session';

/** Erreur HTTP renvoyée par l'API, avec son code et son corps JSON éventuel. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(messageDe(body) ?? `L'API a répondu ${status}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * Message lisible d'une réponse d'erreur NestJS : `message` est une chaîne,
 * ou une liste quand la validation des champs échoue (on garde la première).
 */
function messageDe(body: unknown): string | null {
  const message = (body as { message?: unknown } | null)?.message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && typeof message[0] === 'string') return message[0];
  return null;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Appelle l'API et renvoie son JSON (undefined pour une réponse vide).
 * Ajoute le jeton de session ; un 401 ferme la session locale.
 */
export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const token = jetonActuel();
  const response = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }
  if (!response.ok) {
    if (response.status === 401 && token) signalerSessionExpiree();
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

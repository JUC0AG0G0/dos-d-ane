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

/** Envoie un fichier (multipart) et renvoie le JSON de la réponse. */
function upload<T>(path: string, file: File): Promise<T> {
  const body = new FormData();
  body.append('file', file);
  return send<T>('POST', path, body, async (response) => {
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  });
}

/** Télécharge un fichier protégé (média) : le jeton ne peut pas passer par <img src>. */
function blob(path: string): Promise<Blob> {
  return send('GET', path, undefined, (response) => response.blob());
}

async function send<T>(
  method: Method,
  path: string,
  body: BodyInit | undefined,
  read: (response: Response) => Promise<T>,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });
  if (!response.ok) {
    if (response.status === 401 && token) useAuthStore.getState().signOut();
    const text = await response.text().catch(() => '');
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = undefined;
    }
    throw new ApiError(response.status, data);
  }
  return read(response);
}

/**
 * Lit un flux Server-Sent Events et appelle onEvent pour chaque message,
 * jusqu'à la fin du flux ou signal.abort(). Pas d'EventSource : il ne sait pas
 * envoyer le jeton (Authorization).
 */
async function events(
  path: string,
  onEvent: (event: string, data: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const token = useAuthStore.getState().accessToken;
  const response = await fetch(`${env.apiUrl}${path}`, {
    headers: {
      Accept: 'text/event-stream',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    signal,
  });
  if (!response.ok || !response.body) {
    if (response.status === 401 && token) useAuthStore.getState().signOut();
    throw new ApiError(response.status, undefined);
  }
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let pending = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    // Un message finit par une ligne vide ; le dernier morceau peut être coupé.
    const blocks = (pending + value).replace(/\r/g, '').split('\n\n');
    pending = blocks.pop() ?? '';
    for (const block of blocks) {
      let event = 'message';
      const data: string[] = [];
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
      }
      if (data.length > 0) onEvent(event, data.join('\n'));
    }
  }
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
  upload,
  blob,
  events,
};

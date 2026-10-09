/** Erreur HTTP renvoyée par l'API, avec son code et son corps JSON éventuel. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`L'API a répondu ${status}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * Appelle l'API (`path` sans le préfixe /api) et renvoie son JSON.
 * En dev, Vite relaie /api vers le serveur ; en production, c'est nginx :
 * le navigateur reste sur la même origine, sans CORS.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, body);
  return body as T;
}

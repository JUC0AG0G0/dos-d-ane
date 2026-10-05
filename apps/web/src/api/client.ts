/**
 * Toutes les requêtes passent par le préfixe relatif /api :
 * - en dev, Vite le redirige vers le backend (voir vite.config.ts) ;
 * - en Docker, nginx le redirige vers le conteneur backend.
 * La même image web fonctionne ainsi dans tous les environnements.
 */
export const API_BASE = '/api'

export interface Health {
  status: string
  env: string
  version: string
}

export async function fetchHealth(signal?: AbortSignal): Promise<Health> {
  const res = await fetch(`${API_BASE}/health`, { signal })
  if (!res.ok) {
    throw new Error(`API indisponible (${res.status})`)
  }
  return (await res.json()) as Health
}

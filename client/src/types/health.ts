/** Réponse de GET /api/health (server/src/health/health.controller.ts). */
export interface Health {
  status: 'ok' | 'error';
  database: 'up' | 'down';
  env: string;
  version: string;
}

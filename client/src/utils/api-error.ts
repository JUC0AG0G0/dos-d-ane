import { ApiError } from '@/services';

/**
 * Message d'erreur à afficher après un appel à l'API : celui renvoyé par le
 * serveur (le premier s'il y en a plusieurs), sinon fallback.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 413) return 'Fichier trop lourd.';
    const message = (error.body as { message?: unknown } | null)?.message;
    if (Array.isArray(message) && typeof message[0] === 'string') {
      return message[0];
    }
    if (typeof message === 'string') return message;
  }
  return fallback;
}

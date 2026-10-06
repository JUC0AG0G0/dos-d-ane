export const APP_ENVS = ['development', 'staging', 'production'] as const;

/**
 * Vérifie les variables d'environnement au démarrage : l'API refuse de
 * démarrer si une valeur est absente ou invalide.
 * Ajouter ici chaque nouvelle variable (et dans les fichiers .env*.example).
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const errors: string[] = [];

  const appEnv = config.APP_ENV ?? 'development';
  if (!APP_ENVS.includes(appEnv as (typeof APP_ENVS)[number])) {
    errors.push(`APP_ENV doit valoir ${APP_ENVS.join(', ')}`);
  }

  const port = Number(config.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push('PORT doit être un entier entre 1 et 65535');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration invalide : ${errors.join('; ')}`);
  }
  return { ...config, APP_ENV: appEnv, PORT: port };
}

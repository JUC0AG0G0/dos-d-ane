import { AppEnv, validateEnv } from './env.validation.js';

describe('validateEnv', () => {
  const valid = { SENSOR_API_KEY: 'a'.repeat(32) };

  it('applique les valeurs par défaut', () => {
    const env = validateEnv(valid);
    expect(env.APP_ENV).toBe(AppEnv.Development);
    expect(env.PORT).toBe(3000);
  });

  it('convertit le port en nombre', () => {
    expect(validateEnv({ ...valid, PORT: '8080' }).PORT).toBe(8080);
  });

  it('refuse une clé capteur trop courte', () => {
    expect(() => validateEnv({ SENSOR_API_KEY: 'court' })).toThrow(
      /SENSOR_API_KEY/,
    );
  });

  it('refuse un environnement inconnu', () => {
    expect(() => validateEnv({ ...valid, APP_ENV: 'recette' })).toThrow(
      /APP_ENV/,
    );
  });
});

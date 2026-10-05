import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Lu au chargement d'AppModule, donc avant le code des tests.
    env: {
      APP_ENV: 'test',
      SENSOR_API_KEY: 'test-key-0123456789abcdef',
    },
  },
});

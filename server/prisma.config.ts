// Configuration de la CLI Prisma (generate, migrate, studio).
// L'URL de la base vient de .env.dev à la racine du dépôt.
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { defineConfig } from 'prisma/config';

expand(config({ path: '../.env.dev', quiet: true }));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? '' },
});

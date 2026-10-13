// Configuration de la CLI Prisma (generate, migrate).
// Les migrations tournent dans le conteneur du serveur (`task db:migrate`),
// où DATABASE_URL est fournie par docker compose. SHADOW_DATABASE_URL n'est
// définie que par `task db:restore` pour calculer l'annulation de migrations.
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation.js';
import { HealthController } from './health/health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Hors Docker (`task start`), lit .env.dev à la racine du dépôt.
      // En Docker, les variables sont injectées par docker compose.
      envFilePath: ['../.env.dev'],
      expandVariables: true,
      validate: validateEnv,
    }),
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

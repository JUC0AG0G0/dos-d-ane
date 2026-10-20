import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdviceModule } from './advice/advice.module.js';
import { AnalysisModule } from './analysis/analysis.module.js';
import { AuthModule } from './auth/auth.module.js';
import { validateEnv } from './config/env.validation.js';
import { DevicesModule } from './devices/devices.module.js';
import { HealthController } from './health/health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Les variables sont injectées par docker compose (depuis .env.dev).
      ignoreEnvFile: true,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AnalysisModule,
    AdviceModule,
    DevicesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

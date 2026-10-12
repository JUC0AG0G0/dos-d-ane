import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { validateEnv } from './config/env.validation.js';
import { DevicesController } from './devices/devices.controller.js';
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
  ],
  controllers: [HealthController, DevicesController],
})
export class AppModule {}

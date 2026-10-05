import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation.js';
import { HealthController } from './health/health.controller.js';
import { MeasurementsModule } from './measurements/measurements.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // En local, `npm run start:dev` lit apps/backend/.env.
      // En Docker, les variables sont injectées par docker compose.
      envFilePath: ['.env'],
      validate: validateEnv,
    }),
    MeasurementsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

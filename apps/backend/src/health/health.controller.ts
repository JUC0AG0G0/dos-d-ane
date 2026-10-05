import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  /** Utilisé par Docker (healthcheck), le CD et le front pour vérifier que l'API répond. */
  @Get()
  check() {
    return {
      status: 'ok',
      env: this.config.get<string>('APP_ENV'),
      version: process.env.APP_VERSION ?? 'dev',
    };
  }
}

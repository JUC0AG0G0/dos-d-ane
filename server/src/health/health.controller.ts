import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  /** Utilisé par Docker (healthcheck) et le front pour vérifier que l'API répond. */
  @Get()
  @ApiOkResponse({ description: "L'API répond" })
  check() {
    return {
      status: 'ok',
      env: this.config.get<string>('APP_ENV'),
      version: process.env.APP_VERSION ?? 'dev',
    };
  }
}

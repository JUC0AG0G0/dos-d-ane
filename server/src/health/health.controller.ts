import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /** Utilisé par Docker (healthcheck) et le front : l'API répond et la base est joignable. */
  @Get()
  @ApiOkResponse({ description: "L'API répond et la base est joignable" })
  @ApiServiceUnavailableResponse({ description: 'La base est injoignable' })
  async check() {
    const result = {
      env: this.config.get<string>('APP_ENV'),
      version: process.env.APP_VERSION ?? 'dev',
    };
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        ...result,
      });
    }
    return { status: 'ok', database: 'up', ...result };
  }
}

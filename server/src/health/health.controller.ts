import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /** Utilisé par Docker (healthcheck) et le front : l'API répond et la base est joignable. */
  @Public()
  @Get()
  @ApiOperation({ summary: "État de l'API et de la base, version déployée" })
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

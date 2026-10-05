import { timingSafeEqual } from 'node:crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/** Vérifie l'en-tête X-Sensor-Key envoyé par les modules capteurs. */
@Injectable()
export class SensorKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = Buffer.from(request.header('x-sensor-key') ?? '');
    const expected = Buffer.from(
      this.config.getOrThrow<string>('SENSOR_API_KEY'),
    );
    if (
      provided.length !== expected.length ||
      !timingSafeEqual(provided, expected)
    ) {
      throw new UnauthorizedException('Clé capteur invalide');
    }
    return true;
  }
}

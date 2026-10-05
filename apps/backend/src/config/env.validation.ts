import 'reflect-metadata';
import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export enum AppEnv {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

/**
 * Variables d'environnement attendues par le backend.
 * L'application refuse de démarrer si une valeur est absente ou invalide,
 * ce qui évite de découvrir une mauvaise configuration en production.
 */
export class EnvironmentVariables {
  @IsEnum(AppEnv)
  APP_ENV: AppEnv = AppEnv.Development;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  /** Origines autorisées pour le CORS, séparées par des virgules. */
  @IsString()
  CORS_ORIGINS: string = 'http://localhost:5173';

  /** Clé partagée avec les modules capteurs (en-tête X-Sensor-Key). */
  @IsString()
  @MinLength(16)
  SENSOR_API_KEY: string;

  @IsOptional()
  @IsString()
  DATABASE_URL?: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    const details = errors
      .map(
        (e) =>
          `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
      )
      .join('; ');
    throw new Error(`Configuration invalide : ${details}`);
  }
  return validated;
}

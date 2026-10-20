import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { BodyPart } from '../../entities/index.js';
import { AnalysisSessionStatus } from './analysis-responses.dto.js';

/** Filtre de la liste : un état, ou open (en préparation, en cours ou en pause). */
export const SESSION_STATUS_FILTERS = [
  ...Object.values(AnalysisSessionStatus),
  'open',
] as const;
export type SessionStatusFilter = (typeof SESSION_STATUS_FILTERS)[number];

// Les paramètres de requête arrivent en texte (ValidationPipe sans transform) :
// @Type sert à la validation, le contrôleur convertit ensuite avec Number().

export class ListSessionsQueryDto {
  @ApiPropertyOptional({ enum: SESSION_STATUS_FILTERS })
  @IsOptional()
  @IsIn(SESSION_STATUS_FILTERS, { message: 'Statut inconnu' })
  status?: SessionStatusFilter;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite invalide' })
  @Min(1, { message: 'Limite invalide' })
  @Max(100, { message: 'Limite invalide' })
  limit?: string;
}

export class CapturePageQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'nextCursor de la page précédente',
  })
  @IsOptional()
  @IsUUID('all', { message: 'Curseur invalide' })
  cursor?: string;

  @ApiPropertyOptional({ example: 50, minimum: 1, maximum: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite invalide' })
  @Min(1, { message: 'Limite invalide' })
  @Max(200, { message: 'Limite invalide' })
  limit?: string;
}

export class TimelineQueryDto {
  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 1440 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Taille de tranche invalide' })
  @Min(1, { message: 'Taille de tranche invalide' })
  @Max(1440, { message: 'Taille de tranche invalide' })
  bucketMinutes?: string;
}

export class StartAnalysisSessionDto {
  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description:
      'Appareils qui participent à la session. Par défaut : l’appareil qui fait la requête s’il peut capturer, aucun sinon.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique({ message: 'Appareil en double' })
  @IsUUID('all', { each: true, message: 'Identifiant invalide' })
  deviceIds?: string[];
}

export class AddSessionDeviceDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('all', { message: 'Identifiant invalide' })
  deviceId: string;
}

export class KeypointInputDto {
  @ApiProperty({ enum: BodyPart, enumName: 'BodyPart' })
  @IsEnum(BodyPart, { message: 'Articulation inconnue' })
  bodyPart: BodyPart;

  @ApiProperty({
    example: 320,
    minimum: 0,
    description: 'Pixels depuis la gauche',
  })
  @IsInt()
  @Min(0)
  x: number;

  @ApiProperty({
    example: 140,
    minimum: 0,
    description: 'Pixels depuis le haut',
  })
  @IsInt()
  @Min(0)
  y: number;

  @ApiPropertyOptional({ example: 0.87, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;
}

export class CreateCaptureDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Appareil qui a pris l’image. Par défaut : celui qui fait la requête.',
  })
  @IsOptional()
  @IsUUID('all', { message: 'Identifiant invalide' })
  deviceId?: string;

  @ApiPropertyOptional({
    example: '2026-10-13T14:05:12.345Z',
    description:
      'Moment de la prise de vue. Par défaut : réception par le serveur.',
  })
  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'Date invalide' })
  capturedAt?: string;

  @ApiProperty({ example: 640, minimum: 1 })
  @IsInt()
  @Min(1)
  @Max(20000)
  imageWidth: number;

  @ApiProperty({ example: 480, minimum: 1 })
  @IsInt()
  @Min(1)
  @Max(20000)
  imageHeight: number;

  @ApiProperty({
    type: [KeypointInputDto],
    description:
      'Points détectés, 17 au plus (format COCO), chaque articulation au plus une fois. Les articulations non détectées sont simplement absentes.',
  })
  @IsArray()
  @ArrayMaxSize(17)
  @ArrayUnique((k: KeypointInputDto) => k?.bodyPart, {
    message: 'Articulation en double',
  })
  @ValidateNested({ each: true })
  @Type(() => KeypointInputDto)
  keypoints: KeypointInputDto[];
}

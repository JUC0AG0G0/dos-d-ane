import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  Matches,
  Max,
  Min,
  ValidateBy,
  ValidateIf,
  type ValidationOptions,
} from 'class-validator';
import { PostureEventType } from '../../entities/index.js';

const EVENT_TYPES = Object.values(PostureEventType);

/** Causes possibles d'une alerte « vers l'avant » (part de chacune en %). */
export const EVENT_CAUSES = [
  'FORWARD_HEAD',
  'NECK_FLEXION',
  'TRUNK_FORWARD',
  'TRUNK_BACKWARD',
] as const;

/** Id donné par le Pi : evt_0001, res_0001… (lettres, chiffres, _ et -). */
const CLIENT_ID = /^[A-Za-z0-9_-]{1,64}$/;

/** Objet { cause connue: pourcentage entier entre 0 et 100 }. */
function IsCauses(options?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isCauses',
      validator: {
        validate: (value: unknown) =>
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value) &&
          Object.entries(value).every(
            ([cause, part]) =>
              (EVENT_CAUSES as readonly string[]).includes(cause) &&
              Number.isInteger(part) &&
              (part as number) >= 0 &&
              (part as number) <= 100,
          ),
        defaultMessage: () =>
          `causes : { ${EVENT_CAUSES.join(' | ')} : pourcentage entier de 0 à 100 }`,
      },
    },
    options,
  );
}

export class CreatePostureEventDto {
  @ApiProperty({
    example: 'evt_0001',
    description:
      'Id donné par le Pi, le même au début et à la fin de l’alerte. Un message renvoyé ne crée pas de doublon.',
  })
  @Matches(CLIENT_ID, { message: 'clientId invalide' })
  clientId: string;

  @ApiProperty({ enum: EVENT_TYPES, enumName: 'PostureEventType' })
  @IsIn(EVENT_TYPES, { message: 'type inconnu' })
  type: PostureEventType;

  @ApiProperty({
    enum: ['start', 'end'],
    description:
      'start : l’alerte commence (la ligne est créée) ; end : elle se termine (la ligne reçoit endedAt).',
  })
  @IsIn(['start', 'end'], { message: 'phase : start ou end' })
  phase: 'start' | 'end';

  @ApiProperty({ example: '2026-10-19T09:24:28Z', description: 'Heure du Pi' })
  @IsISO8601({ strict: true }, { message: 'Date invalide' })
  startedAt: string;

  @ApiPropertyOptional({
    example: '2026-10-19T09:27:40Z',
    description: 'Obligatoire pour end',
  })
  @ValidateIf((dto: CreatePostureEventDto) => dto.phase === 'end')
  @IsISO8601({ strict: true }, { message: 'endedAt obligatoire pour end' })
  endedAt?: string;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 48.2,
    description:
      'Angle moyen de la tête au déclenchement (absent pour IMMOBILE)',
  })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  headAngleAvg?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 22.5 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  trunkAngleAvg?: number | null;

  @ApiPropertyOptional({
    example: { FORWARD_HEAD: 60, NECK_FLEXION: 40 },
    description: 'Part de chaque cause dans l’alerte, en %',
  })
  @IsOptional()
  @IsCauses()
  causes?: Record<string, number> | null;
}

export class CreatePostureSummaryDto {
  @ApiProperty({ example: 'res_0001' })
  @Matches(CLIENT_ID, { message: 'clientId invalide' })
  clientId: string;

  @ApiProperty({ example: '2026-10-19T09:20:00Z' })
  @IsISO8601({ strict: true }, { message: 'Date invalide' })
  periodStart: string;

  @ApiProperty({ example: '2026-10-19T09:25:00Z' })
  @IsISO8601({ strict: true }, { message: 'Date invalide' })
  periodEnd: string;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 78,
    description: '% du temps en bonne posture ; null si rien n’a été suivi',
  })
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(0)
  @Max(100)
  score: number | null;

  @ApiProperty({ example: 210, description: 'Secondes en vert' })
  @IsInt()
  @Min(0)
  secondsGreen: number;

  @ApiProperty({ example: 60, description: 'Secondes en orange (en doute)' })
  @IsInt()
  @Min(0)
  secondsOrange: number;

  @ApiProperty({ example: 30, description: 'Secondes en rouge (alerte)' })
  @IsInt()
  @Min(0)
  secondsRed: number;

  @ApiProperty({ example: 0, description: 'Secondes d’images mal vues' })
  @IsInt()
  @Min(0)
  secondsIgnored: number;

  @ApiProperty({ example: 0, description: 'Secondes sans personne' })
  @IsInt()
  @Min(0)
  secondsAbsent: number;
}

export class PostureEventDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'evt_0001' })
  clientId: string;

  @ApiProperty({
    format: 'uuid',
    description: 'Appareil qui a envoyé l’alerte',
  })
  deviceId: string;

  @ApiProperty({ enum: EVENT_TYPES, enumName: 'PostureEventType' })
  type: string;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'null tant que l’alerte dure (ou si le Pi s’est arrêté avant)',
  })
  endedAt: Date | null;

  @ApiProperty({ type: Number, nullable: true, example: 192 })
  durationSeconds: number | null;

  @ApiProperty({ type: Number, nullable: true })
  headAngleAvg: number | null;

  @ApiProperty({ type: Number, nullable: true })
  trunkAngleAvg: number | null;

  @ApiProperty({
    type: Object,
    nullable: true,
    example: { FORWARD_HEAD: 60, NECK_FLEXION: 40 },
  })
  causes: Record<string, number> | null;
}

export class PostureSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'res_0001' })
  clientId: string;

  @ApiProperty({ format: 'uuid' })
  deviceId: string;

  @ApiProperty()
  periodStart: Date;

  @ApiProperty()
  periodEnd: Date;

  @ApiProperty({ type: Number, nullable: true, example: 78 })
  score: number | null;

  @ApiProperty({ example: 210 })
  secondsGreen: number;

  @ApiProperty({ example: 60 })
  secondsOrange: number;

  @ApiProperty({ example: 30 })
  secondsRed: number;

  @ApiProperty({ example: 0 })
  secondsIgnored: number;

  @ApiProperty({ example: 0 })
  secondsAbsent: number;
}

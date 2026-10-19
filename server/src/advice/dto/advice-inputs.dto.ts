import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  CONTENT_STATUSES,
  EXERCISE_POSTURES,
  EXERCISE_TYPES,
  EXERCISE_ZONES,
  MAX_ZONE_EXERCISES,
  type ContentStatus,
  type ExerciseType,
  type ExerciseZone,
} from '../advice.constants.js';

/** Enlève les espaces autour d'un texte (et de chaque texte d'une liste). */
const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? value.trim()
      : Array.isArray(value)
        ? value.map((v) => (typeof v === 'string' ? v.trim() : v))
        : value,
  );

/** Comme Trim, et un texte vide devient null (source facultative). */
const TrimToNull = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : value,
  );

const HTTPS_URL = /^https:\/\/[^\s]+\.[^\s]+$/;

/** Source : libellé + lien https://, ensemble ou pas du tout (vérifié par le service). */
class SourceInput {
  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 120 })
  @IsOptional()
  @TrimToNull()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(120)
  sourceLabel?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example:
      'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html',
  })
  @IsOptional()
  @TrimToNull()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(500)
  @Matches(HTTPS_URL, {
    message: 'Le lien de la source doit commencer par https://',
  })
  sourceUrl?: string | null;
}

// --- Exercices ---------------------------------------------------------------

export class ExerciseQueryDto {
  @ApiPropertyOptional({ enum: EXERCISE_TYPES })
  @IsOptional()
  @IsIn(EXERCISE_TYPES, { message: 'Type inconnu' })
  type?: ExerciseType;

  @ApiPropertyOptional({ enum: EXERCISE_ZONES })
  @IsOptional()
  @IsIn(EXERCISE_ZONES, { message: 'Partie du corps inconnue' })
  zone?: ExerciseZone;
}

export class AdminExerciseQueryDto extends ExerciseQueryDto {
  @ApiPropertyOptional({ description: 'Recherche dans le titre' })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ enum: CONTENT_STATUSES })
  @IsOptional()
  @IsIn(CONTENT_STATUSES, { message: 'Statut inconnu' })
  status?: ContentStatus;
}

export class CreateExerciseDto {
  @ApiProperty({ example: 'Rentrer le menton', maxLength: 120 })
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Le titre est obligatoire' })
  @MaxLength(120)
  title: string;

  @ApiProperty({ enum: EXERCISE_ZONES })
  @IsIn(EXERCISE_ZONES, { message: 'Partie du corps inconnue' })
  zone: ExerciseZone;

  @ApiProperty({ example: 60, minimum: 5, maximum: 3600 })
  @IsInt({ message: 'Durée en secondes' })
  @Min(5)
  @Max(3600)
  durationSeconds: number;

  @ApiPropertyOptional({ enum: EXERCISE_POSTURES, default: 'assis ou debout' })
  @IsOptional()
  @IsIn(EXERCISE_POSTURES, { message: 'Position inconnue' })
  posture?: string;

  @ApiProperty({ description: 'Au moins un des deux types' })
  @IsBoolean()
  isPreventive: boolean;

  @ApiProperty()
  @IsBoolean()
  isForPain: boolean;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(1000)
  precautions?: string;

  @ApiPropertyOptional({
    type: [String],
    description:
      'Étapes dans l’ordre (au moins une pour publier) ; remplacent les anciennes',
  })
  @IsOptional()
  @Trim()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MinLength(1, { each: true, message: 'Une étape est vide' })
  @MaxLength(500, { each: true })
  steps?: string[];

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    nullable: true,
    description:
      'Média envoyé par POST /api/admin/advice/media ; null pour le retirer',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsUUID('all', { message: 'Média invalide' })
  mediaId?: string | null;

  @ApiPropertyOptional({ enum: CONTENT_STATUSES, default: 'draft' })
  @IsOptional()
  @IsIn(CONTENT_STATUSES, { message: 'Statut inconnu' })
  status?: ContentStatus;
}

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}

// --- Ordres (glisser-déposer) ------------------------------------------------

export class OrderDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    description: 'Tous les identifiants, dans le nouvel ordre',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @ArrayUnique({ message: 'Identifiant en double' })
  @IsUUID('all', { each: true, message: 'Identifiant invalide' })
  ids: string[];
}

// --- Réglages du poste -------------------------------------------------------

export class UpdatePostureTipDto extends SourceInput {
  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Le titre est obligatoire' })
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ maxLength: 300 })
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Le texte court est obligatoire' })
  @MaxLength(300)
  shortText?: string;

  @ApiPropertyOptional({ maxLength: 1500 })
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Le texte du tuto est obligatoire' })
  @MaxLength(1500)
  tutorialText?: string;

  @ApiPropertyOptional({
    description: 'Masqué : absent de la page, du schéma et du tuto',
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

// --- Repères douleur ---------------------------------------------------------

export class CreatePainZoneDto extends SourceInput {
  @ApiProperty({ example: 'Bas du dos', maxLength: 60 })
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Le nom de la zone est obligatoire' })
  @MaxLength(60)
  name: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(500)
  intro?: string;

  @ApiPropertyOptional({
    type: [String],
    description: '« Ce qui aide », dans l’ordre',
  })
  @IsOptional()
  @Trim()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(1, { each: true, message: 'Un point est vide' })
  @MaxLength(300, { each: true })
  helps?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: '« À éviter », dans l’ordre',
  })
  @IsOptional()
  @Trim()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(1, { each: true, message: 'Un point est vide' })
  @MaxLength(300, { each: true })
  avoid?: string[];

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: `Exercices conseillés publiés, dans l’ordre (${MAX_ZONE_EXERCISES} au plus)`,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_ZONE_EXERCISES, {
    message: `${MAX_ZONE_EXERCISES} exercices conseillés au maximum`,
  })
  @ArrayUnique({ message: 'Exercice en double' })
  @IsUUID('all', { each: true, message: 'Identifiant invalide' })
  exerciseIds?: string[];

  @ApiPropertyOptional({ enum: CONTENT_STATUSES, default: 'draft' })
  @IsOptional()
  @IsIn(CONTENT_STATUSES, { message: 'Statut inconnu' })
  status?: ContentStatus;
}

export class UpdatePainZoneDto extends PartialType(CreatePainZoneDto) {}

export class UpdateAdviceSettingDto {
  @ApiProperty({ maxLength: 1000 })
  @Trim()
  @IsString()
  @MinLength(1, { message: 'Le texte est obligatoire' })
  @MaxLength(1000)
  text: string;
}

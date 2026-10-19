import { ApiProperty } from '@nestjs/swagger';
import {
  CONTENT_STATUSES,
  EXERCISE_ZONES,
  POSTURE_TIP_KEYS,
  type ContentStatus,
  type ExerciseZone,
  type PostureTipKey,
} from '../advice.constants.js';

/** Média rattaché à un contenu ; le fichier se lit sur GET /api/advice/media/{id}. */
export class MediaRefDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ enum: ['image/gif', 'image/png', 'video/mp4'] })
  mimeType: string;
}

export class SourceFields {
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'INRS · Le travail sur écran',
  })
  sourceLabel: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example:
      'https://www.inrs.fr/risques/travail-ecran/prevention-risques.html',
    description: 'https:// ; ouvert dans un nouvel onglet',
  })
  sourceUrl: string | null;
}

// --- Exercices ---------------------------------------------------------------

export class ExerciseSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Rentrer le menton' })
  title: string;

  @ApiProperty({ enum: EXERCISE_ZONES, example: 'nuque' })
  zone: ExerciseZone;

  @ApiProperty({ description: 'Type préventif' })
  isPreventive: boolean;

  @ApiProperty({ description: 'Type « en cas de douleur »' })
  isForPain: boolean;

  @ApiProperty({ example: 60 })
  durationSeconds: number;

  @ApiProperty({ example: 'assis ou debout' })
  posture: string;

  @ApiProperty({ type: MediaRefDto, nullable: true })
  media: MediaRefDto | null;
}

export class ExerciseDto extends ExerciseSummaryDto {
  @ApiProperty({ example: 'Mouvement lent, sans forcer.' })
  precautions: string;

  @ApiProperty({
    type: [String],
    description: 'Étapes « Comment faire », dans l’ordre',
  })
  steps: string[];
}

export class ExerciseCountsDto {
  @ApiProperty({ example: 7 })
  all: number;

  @ApiProperty({ example: 6 })
  preventive: number;

  @ApiProperty({ example: 4 })
  pain: number;
}

export class ExerciseListDto {
  @ApiProperty({ type: [ExerciseSummaryDto] })
  items: ExerciseSummaryDto[];

  @ApiProperty({
    type: ExerciseCountsDto,
    description: 'Nombre d’exercices par type, pour la partie du corps choisie',
  })
  counts: ExerciseCountsDto;
}

export class AdminExerciseDto extends ExerciseDto {
  @ApiProperty({ enum: CONTENT_STATUSES })
  status: ContentStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// --- Réglages du poste -------------------------------------------------------

export class PostureTipDto extends SourceFields {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    enum: POSTURE_TIP_KEYS,
    description:
      'Élément du poste : fixe l’icône et la place du repère sur le schéma',
  })
  key: PostureTipKey;

  @ApiProperty({ example: 'Écran à hauteur des yeux' })
  title: string;

  @ApiProperty()
  shortText: string;

  @ApiProperty()
  tutorialText: string;

  @ApiProperty({ type: MediaRefDto, nullable: true })
  media: MediaRefDto | null;
}

export class AdminPostureTipDto extends PostureTipDto {
  @ApiProperty({
    description: 'Masqué : absent de la page, du schéma et du tuto',
  })
  isVisible: boolean;

  @ApiProperty()
  updatedAt: Date;
}

// --- Repères douleur ---------------------------------------------------------

export class PainZoneDto extends SourceFields {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Bas du dos' })
  name: string;

  @ApiProperty()
  intro: string;

  @ApiProperty({ type: [String], description: '« Ce qui aide », dans l’ordre' })
  helps: string[];

  @ApiProperty({ type: [String], description: '« À éviter », dans l’ordre' })
  avoid: string[];

  @ApiProperty({
    type: [ExerciseSummaryDto],
    description:
      'Exercices conseillés (3 au plus), publiés, dans l’ordre choisi',
  })
  exercises: ExerciseSummaryDto[];
}

export class PainZonesDto {
  @ApiProperty({
    description: 'Message « Quand consulter un médecin », commun aux zones',
  })
  whenToSeeDoctor: string;

  @ApiProperty({ type: [PainZoneDto] })
  zones: PainZoneDto[];
}

export class AdminPainZoneDto extends PainZoneDto {
  @ApiProperty({ enum: CONTENT_STATUSES })
  status: ContentStatus;

  @ApiProperty()
  updatedAt: Date;
}

export class AdminPainZonesDto {
  @ApiProperty()
  whenToSeeDoctor: string;

  @ApiProperty({ type: [AdminPainZoneDto] })
  zones: AdminPainZoneDto[];
}

export class AdviceSettingDto {
  @ApiProperty()
  text: string;
}

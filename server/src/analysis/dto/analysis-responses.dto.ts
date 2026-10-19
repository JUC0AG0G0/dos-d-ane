import { ApiProperty } from '@nestjs/swagger';
import { BodyPart, DeviceType } from '../../entities/index.js';

export const AnalysisSessionStatus = {
  Setup: 'setup',
  Running: 'running',
  Paused: 'paused',
  Ended: 'ended',
} as const;
export type AnalysisSessionStatus =
  (typeof AnalysisSessionStatus)[keyof typeof AnalysisSessionStatus];

export class SessionDeviceSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Raspberry du bureau' })
  name: string;

  @ApiProperty({ enum: Object.values(DeviceType), example: DeviceType.Mobile })
  type: string;

  @ApiProperty({
    example: 236,
    description: 'Captures envoyées dans la session',
  })
  captureCount: number;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Retrait de la session ou fin de la session ; null si actif',
  })
  leftAt: Date | null;
}

export class AnalysisSessionSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    enum: Object.values(AnalysisSessionStatus),
    enumName: 'AnalysisSessionStatus',
    description:
      'setup : en préparation (appareils modifiables, pas de capture) ; running : en cours ; paused : en pause (captures refusées) ; ended : terminée',
  })
  status: AnalysisSessionStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'null tant que la session est en préparation',
  })
  startedAt: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'null tant que la session est en cours',
  })
  endedAt: Date | null;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 1830,
    description:
      'Durée active en secondes, pauses non comprises (jusqu’à maintenant si la session est ouverte, null en préparation)',
  })
  durationSeconds: number | null;

  @ApiProperty({
    example: 420,
    description: 'Temps total de pause en secondes (pause en cours comprise)',
  })
  pausedSeconds: number;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Début de la pause en cours ; null hors pause',
  })
  pausedSince: Date | null;

  @ApiProperty({ example: 42 })
  captureCount: number;

  @ApiProperty({ example: 1 })
  deviceCount: number;

  @ApiProperty({ type: Date, nullable: true })
  lastCaptureAt: Date | null;

  @ApiProperty({
    type: [SessionDeviceSummaryDto],
    description: 'Appareils de la session, dans l’ordre d’ajout',
  })
  devices: SessionDeviceSummaryDto[];
}

export class AnalysisSessionDeviceDto extends SessionDeviceSummaryDto {
  @ApiProperty({ description: 'Ajout à la session' })
  joinedAt: Date;

  @ApiProperty({ type: Date, nullable: true })
  lastCaptureAt: Date | null;
}

export class CaptureSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  deviceId: string;

  @ApiProperty()
  capturedAt: Date;

  @ApiProperty({ example: 13 })
  keypointCount: number;
}

export class LastCaptureDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  deviceId: string;

  @ApiProperty()
  capturedAt: Date;
}

export class SessionPauseDto {
  @ApiProperty()
  startedAt: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'null tant que la pause dure',
  })
  endedAt: Date | null;
}

export class AnalysisSessionDetailDto extends AnalysisSessionSummaryDto {
  @ApiProperty({ type: [AnalysisSessionDeviceDto] })
  declare devices: AnalysisSessionDeviceDto[];

  @ApiProperty({
    type: LastCaptureDto,
    nullable: true,
    description: 'Capture la plus récente (points : GET /captures/:id)',
  })
  lastCapture: LastCaptureDto | null;

  @ApiProperty({
    type: [SessionPauseDto],
    description: 'Pauses de la plus ancienne à la plus récente',
  })
  pauses: SessionPauseDto[];
}

export class CapturePageDto {
  @ApiProperty({
    type: [CaptureSummaryDto],
    description: 'Captures de la plus ancienne à la plus récente',
  })
  items: CaptureSummaryDto[];

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'uuid',
    description: 'À passer en cursor pour la page suivante ; null à la fin',
  })
  nextCursor: string | null;
}

export class TimelineBucketDto {
  @ApiProperty({ description: 'Début de la tranche' })
  start: Date;

  @ApiProperty({ example: 12 })
  count: number;
}

export class SessionTimelineDto {
  @ApiProperty({
    type: [TimelineBucketDto],
    description: 'Du début à la fin de la session, tranches vides comprises',
  })
  buckets: TimelineBucketDto[];

  @ApiProperty({ type: [SessionPauseDto] })
  pauses: SessionPauseDto[];
}

export class WeekStatsDto {
  @ApiProperty({ example: 4, description: 'Sessions lancées dans la semaine' })
  sessions: number;

  @ApiProperty({
    example: 34800,
    description: 'Durée active de ces sessions, en secondes',
  })
  durationSeconds: number;

  @ApiProperty({
    example: 3218,
    description: 'Captures prises dans la semaine',
  })
  captures: number;
}

export class LastWeekStatsDto {
  @ApiProperty({ example: 2 })
  sessions: number;
}

export class AnalysisStatsDto {
  @ApiProperty({
    type: WeekStatsDto,
    description: 'Depuis lundi 00:00, heure de Paris',
  })
  thisWeek: WeekStatsDto;

  @ApiProperty({ type: LastWeekStatsDto })
  lastWeek: LastWeekStatsDto;
}

export class KeypointDto {
  @ApiProperty({ enum: BodyPart, enumName: 'BodyPart' })
  bodyPart: BodyPart;

  @ApiProperty({ example: 320 })
  x: number;

  @ApiProperty({ example: 140 })
  y: number;

  @ApiProperty({ type: Number, nullable: true, example: 0.87 })
  confidence: number | null;
}

export class CaptureDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  analysisSessionId: string;

  @ApiProperty({ format: 'uuid' })
  deviceId: string;

  @ApiProperty()
  capturedAt: Date;

  @ApiProperty({ example: 640 })
  imageWidth: number;

  @ApiProperty({ example: 480 })
  imageHeight: number;

  @ApiProperty({
    type: [KeypointDto],
    description: 'Seulement les articulations détectées',
  })
  keypoints: KeypointDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { BodyPart, DeviceType } from '../../entities/index.js';

export const AnalysisSessionStatus = {
  Setup: 'setup',
  Running: 'running',
  Ended: 'ended',
} as const;
export type AnalysisSessionStatus =
  (typeof AnalysisSessionStatus)[keyof typeof AnalysisSessionStatus];

export class AnalysisSessionSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    enum: Object.values(AnalysisSessionStatus),
    enumName: 'AnalysisSessionStatus',
    description:
      'setup : en préparation (appareils modifiables, pas de capture) ; running : en cours ; ended : terminée',
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
      'Durée en secondes (jusqu’à maintenant si la session est en cours, null en préparation)',
  })
  durationSeconds: number | null;

  @ApiProperty({ example: 42 })
  captureCount: number;

  @ApiProperty({ example: 1 })
  deviceCount: number;
}

export class AnalysisSessionDeviceDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Raspberry du bureau' })
  name: string;

  @ApiProperty({ enum: Object.values(DeviceType), example: DeviceType.Mobile })
  type: string;

  @ApiProperty({ description: 'Ajout à la session' })
  joinedAt: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Retrait de la session ou fin de la session ; null si actif',
  })
  leftAt: Date | null;
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

export class AnalysisSessionDetailDto extends AnalysisSessionSummaryDto {
  @ApiProperty({ type: [AnalysisSessionDeviceDto] })
  devices: AnalysisSessionDeviceDto[];

  @ApiProperty({
    type: [CaptureSummaryDto],
    description: 'Captures de la plus ancienne à la plus récente',
  })
  captures: CaptureSummaryDto[];
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

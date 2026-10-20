import { ApiProperty } from '@nestjs/swagger';
import { CaptureStatus, DeviceType } from '../../entities/index.js';

export class DeviceDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Raspberry du bureau' })
  name: string;

  @ApiProperty({ enum: Object.values(DeviceType), example: DeviceType.Mobile })
  type: string;

  @ApiProperty({ type: String, nullable: true })
  model: string | null;

  @ApiProperty({ description: 'Peut capturer (jamais un navigateur)' })
  captureEligible: boolean;

  @ApiProperty({
    type: String,
    enum: Object.values(CaptureStatus),
    nullable: true,
    description:
      'Capture activée ou coupée sur l’appareil ; null s’il ne peut pas capturer',
  })
  captureStatus: string | null;

  @ApiProperty({ description: 'Appareil de la requête en cours' })
  current: boolean;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description:
      'Session ouverte (préparation, en cours ou en pause) où l’appareil est actif',
  })
  openSessionId: string | null;
}

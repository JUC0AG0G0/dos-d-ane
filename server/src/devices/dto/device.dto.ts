import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '../../entities/index.js';

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

  @ApiProperty({ description: 'Appareil de la requête en cours' })
  current: boolean;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description:
      'Session lancée (en cours ou en pause) où l’appareil capture ; null s’il est libre',
  })
  openSessionId: string | null;

  @ApiProperty({
    type: String,
    enum: ['active', 'pending', 'revoked'],
    nullable: true,
    description:
      'Clé d’un Raspberry Pi : active ; pending, ajouté par son code mais clé pas encore relevée ; revoked, révoquée (le Pi attend d’être ajouté de nouveau). null si ce n’est pas un Raspberry Pi',
  })
  keyStatus: 'active' | 'pending' | 'revoked' | null;
}

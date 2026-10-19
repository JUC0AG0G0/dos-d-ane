import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Matches } from 'class-validator';

export class DeviceLoginDto {
  @ApiProperty({
    format: 'uuid',
    description: 'deviceId renvoyé par POST /devices',
  })
  @IsUUID('all', { message: 'Identifiant invalide' })
  deviceId: string;

  @ApiProperty({
    example: 'dk_3q2-7wE…',
    description: 'Clé renvoyée par POST /devices ou /devices/:id/key',
  })
  @Matches(/^dk_[A-Za-z0-9_-]{43}$/, { message: 'Clé invalide' })
  key: string;
}

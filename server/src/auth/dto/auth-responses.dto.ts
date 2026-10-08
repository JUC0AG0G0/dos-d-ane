import { ApiProperty } from '@nestjs/swagger';
import { DeviceType, Role } from '../../entities/index.js';

export class UserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'jules@example.com' })
  email: string;

  @ApiProperty({ example: 'Jules' })
  displayName: string;

  @ApiProperty({ enum: Role, enumName: 'Role', example: Role.user })
  role: Role;

  @ApiProperty()
  createdAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT à envoyer dans Authorization: Bearer <token>',
  })
  accessToken: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty({ format: 'uuid' })
  sessionId: string;

  @ApiProperty({
    format: 'uuid',
    description: 'À garder côté client et renvoyer à la prochaine connexion',
  })
  deviceId: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class SessionDeviceDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Firefox sur Linux' })
  name: string;

  @ApiProperty({ enum: Object.values(DeviceType), example: DeviceType.Web })
  type: string;

  @ApiProperty({ type: String, nullable: true })
  model: string | null;
}

export class SessionDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: SessionDeviceDto })
  device: SessionDeviceDto;

  @ApiProperty({ description: 'Ni révoquée ni expirée' })
  active: boolean;

  @ApiProperty({ description: 'Session de la requête en cours' })
  current: boolean;

  @ApiProperty({ description: 'Date de connexion' })
  createdAt: Date;

  @ApiProperty({ description: 'Dernière requête (à la minute près)' })
  lastUsedAt: Date;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Date de déconnexion',
  })
  revokedAt: Date | null;
}

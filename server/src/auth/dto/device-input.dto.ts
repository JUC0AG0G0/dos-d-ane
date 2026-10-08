import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { DeviceType } from '../../entities/index.js';

/** Appareils depuis lesquels on peut se connecter. */
export const LOGIN_DEVICE_TYPES = [DeviceType.Web, DeviceType.Mobile] as const;
export type LoginDeviceType = (typeof LOGIN_DEVICE_TYPES)[number];

/**
 * Appareil de connexion, facultatif (navigateur web par défaut). Le client
 * garde l'id renvoyé par la première connexion et le renvoie ensuite :
 * l'appareil est réutilisé au lieu d'en créer un nouveau.
 */
export class DeviceInputDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Appareil déjà connu (deviceId renvoyé à la connexion)',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ enum: LOGIN_DEVICE_TYPES, example: DeviceType.Web })
  @IsIn(LOGIN_DEVICE_TYPES)
  type: LoginDeviceType;

  @ApiPropertyOptional({
    example: 'Firefox sur Linux',
    description: 'Nom affiché dans la liste des sessions',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Pixel 8' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  model?: string;
}

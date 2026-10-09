import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { DeviceType } from '../../entities/index.js';

/** Appareils depuis lesquels on peut se connecter. */
export const LOGIN_DEVICE_TYPES = [DeviceType.Web, DeviceType.Mobile] as const;
export type LoginDeviceType = (typeof LOGIN_DEVICE_TYPES)[number];

/**
 * Appareil de connexion, facultatif. Son nom et son modèle sont déduits du
 * User-Agent. Le client garde l'id renvoyé par la première connexion et le
 * renvoie ensuite : l'appareil est réutilisé au lieu d'en créer un nouveau.
 */
export class DeviceInputDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Appareil déjà connu (deviceId renvoyé à la connexion)',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    enum: LOGIN_DEVICE_TYPES,
    default: DeviceType.Web,
    description: 'mobile pour l’application mobile, web sinon',
  })
  @IsOptional()
  @IsIn(LOGIN_DEVICE_TYPES)
  type?: LoginDeviceType;
}

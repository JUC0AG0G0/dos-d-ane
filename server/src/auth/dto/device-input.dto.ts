import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { DeviceType } from '../../entities/index.js';

/** Appareils sur lesquels une session peut s'ouvrir. */
export const LOGIN_DEVICE_TYPES = [
  DeviceType.Web,
  DeviceType.Mobile,
  DeviceType.Desktop,
  DeviceType.Raspberry,
] as const;
export type LoginDeviceType = (typeof LOGIN_DEVICE_TYPES)[number];

/**
 * Connexion par mot de passe : pas un Raspberry Pi, qui se connecte avec sa
 * clé (POST /auth/device-login). Sinon chaque essai créerait un Pi sans clé,
 * avec une session aux pleins droits du compte.
 */
export const PASSWORD_LOGIN_DEVICE_TYPES = [
  DeviceType.Web,
  DeviceType.Mobile,
  DeviceType.Desktop,
] as const;

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
    enum: PASSWORD_LOGIN_DEVICE_TYPES,
    default: DeviceType.Web,
    description:
      'mobile (application mobile), desktop (application Electron), web sinon. Seul web ne peut pas envoyer de captures. Un Raspberry Pi se connecte avec sa clé : POST /auth/device-login.',
  })
  @IsOptional()
  @IsIn(PASSWORD_LOGIN_DEVICE_TYPES, {
    message:
      'Type d’appareil invalide (web, mobile ou desktop) : un Raspberry Pi se connecte avec sa clé (POST /auth/device-login)',
  })
  type?: (typeof PASSWORD_LOGIN_DEVICE_TYPES)[number];
}

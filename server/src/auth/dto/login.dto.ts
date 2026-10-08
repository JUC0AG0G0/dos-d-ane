import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { DeviceInputDto } from './device-input.dto.js';

export class LoginDto {
  @ApiProperty({ example: 'jules@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'un mot de passe assez long' })
  @IsString()
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({
    type: DeviceInputDto,
    description:
      'Facultatif : sans lui, la connexion est enregistrée comme un navigateur web.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInputDto)
  device?: DeviceInputDto;
}

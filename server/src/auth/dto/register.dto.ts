import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LoginDto } from './login.dto.js';

/**
 * Création de compte. Règles du mot de passe selon le NIST SP 800-63B :
 * au moins 8 caractères, pas de règle de composition imposée.
 */
export class RegisterDto extends LoginDto {
  @ApiProperty({ example: 'un mot de passe assez long', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  @MaxLength(128)
  declare password: string;

  @ApiPropertyOptional({ example: 'Jules' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName?: string;
}

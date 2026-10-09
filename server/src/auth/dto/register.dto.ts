import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Création de compte. Règles du mot de passe selon le NIST SP 800-63B :
 * au moins 8 caractères, pas de règle de composition imposée.
 */
export class RegisterDto {
  @ApiProperty({ example: 'jules@example.com', description: 'Unique' })
  @Transform(trim)
  @IsEmail({}, { message: 'Email invalide' })
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'admin1234', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  @MaxLength(128)
  password: string;

  @ApiProperty({
    example: 'Jules',
    minLength: 2,
    maxLength: 50,
    description: 'Unique, sans tenir compte des majuscules',
  })
  @Transform(trim)
  @IsString()
  @MinLength(2, { message: 'Le nom affiché doit faire au moins 2 caractères' })
  @MaxLength(50)
  displayName: string;
}

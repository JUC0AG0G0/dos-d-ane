import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Role } from '../../entities/index.js';

export class UpdateRolesDto {
  @ApiProperty({ type: [String], format: 'uuid' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Aucun utilisateur sélectionné' })
  @ArrayMaxSize(500)
  @IsUUID('all', { each: true, message: 'Identifiant invalide' })
  ids: string[];

  @ApiProperty({ enum: Role, enumName: 'Role', example: Role.admin })
  @IsEnum(Role, { message: 'Rôle invalide' })
  role: Role;
}

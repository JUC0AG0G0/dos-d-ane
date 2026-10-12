import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../entities/index.js';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, enumName: 'Role', example: Role.admin })
  @IsEnum(Role, { message: 'Rôle invalide' })
  role: Role;
}

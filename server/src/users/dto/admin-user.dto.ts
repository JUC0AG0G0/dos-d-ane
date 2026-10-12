import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../entities/index.js';

export class AdminUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'j***@example.com',
    description: 'Email masqué ; GET /api/users/{id}/email pour le voir',
  })
  maskedEmail: string;

  @ApiProperty({ example: 'Jules' })
  displayName: string;

  @ApiProperty({ enum: Role, enumName: 'Role', example: Role.user })
  role: Role;

  @ApiProperty()
  createdAt: Date;
}

export class UserEmailDto {
  @ApiProperty({ example: 'jules@example.com' })
  email: string;
}

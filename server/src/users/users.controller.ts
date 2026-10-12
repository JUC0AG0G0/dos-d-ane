import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators.js';
import { UserDto } from '../auth/dto/auth-responses.dto.js';
import { Role } from '../entities/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

const userSelect = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  createdAt: true,
} as const;

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@ApiForbiddenResponse({ description: 'Réservé aux administrateurs' })
@Roles(Role.admin)
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les utilisateurs' })
  @ApiOkResponse({ type: [UserDto] })
  list(): Promise<UserDto[]> {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'asc' },
    });
  }

  @Patch(':id/role')
  @ApiOperation({
    summary: "Change le rôle d'un utilisateur",
    description: 'Il reste toujours au moins un administrateur.',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Rôle invalide' })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  @ApiConflictResponse({ description: 'Dernier administrateur' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<UserDto> {
    return this.prisma.$transaction(async (tx) => {
      const admins = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM users WHERE role = 'admin' FOR UPDATE`;
      const user = await tx.user.findUnique({
        where: { id },
        select: { role: true },
      });
      if (!user) {
        throw new NotFoundException('Utilisateur introuvable');
      }
      if (
        dto.role !== Role.admin &&
        user.role === Role.admin &&
        admins.length <= 1
      ) {
        throw new ConflictException(
          'Impossible de retirer le dernier administrateur',
        );
      }
      return tx.user.update({
        where: { id },
        data: { role: dto.role },
        select: userSelect,
      });
    });
  }
}

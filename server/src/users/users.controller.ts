import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
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
import { UpdateRolesDto } from './dto/update-roles.dto.js';

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

  @Patch('role')
  @ApiOperation({
    summary: "Change le rôle d'un ou plusieurs utilisateurs",
    description: 'Il reste toujours au moins un administrateur.',
  })
  @ApiOkResponse({ type: [UserDto] })
  @ApiBadRequestResponse({ description: 'Rôle ou identifiants invalides' })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  @ApiConflictResponse({ description: 'Dernier administrateur' })
  updateRoles(@Body() dto: UpdateRolesDto): Promise<UserDto[]> {
    const ids = [...new Set(dto.ids)];
    return this.prisma.$transaction(async (tx) => {
      const admins = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM users WHERE role = 'admin' FOR UPDATE`;
      const count = await tx.user.count({ where: { id: { in: ids } } });
      if (count !== ids.length) {
        throw new NotFoundException('Utilisateur introuvable');
      }
      if (
        dto.role !== Role.admin &&
        admins.every((admin) => ids.includes(admin.id))
      ) {
        throw new ConflictException(
          'Impossible de retirer le dernier administrateur',
        );
      }
      await tx.user.updateMany({
        where: { id: { in: ids } },
        data: { role: dto.role },
      });
      return tx.user.findMany({
        where: { id: { in: ids } },
        select: userSelect,
        orderBy: { createdAt: 'asc' },
      });
    });
  }
}

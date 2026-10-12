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
import { Role } from '../entities/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminUserDto, UserEmailDto } from './dto/admin-user.dto.js';
import { UpdateRolesDto } from './dto/update-roles.dto.js';
import { maskEmail } from './mask-email.js';

const userSelect = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  createdAt: true,
} as const;

const toAdminUser = ({
  email,
  ...user
}: {
  email: string;
} & Omit<AdminUserDto, 'maskedEmail'>): AdminUserDto => ({
  ...user,
  maskedEmail: maskEmail(email),
});

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@ApiForbiddenResponse({ description: 'Réservé aux administrateurs' })
@Roles(Role.admin)
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les utilisateurs (emails masqués)' })
  @ApiOkResponse({ type: [AdminUserDto] })
  async list(): Promise<AdminUserDto[]> {
    const users = await this.prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'asc' },
    });
    return users.map(toAdminUser);
  }

  @Get(':id/email')
  @ApiOperation({
    summary: "Affiche l'email d'un utilisateur",
    description: 'Un seul compte par requête.',
  })
  @ApiOkResponse({ type: UserEmailDto })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  async revealEmail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserEmailDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    // TODO: journal d'audit des affichages d'email (admin, compte, date)
    return user;
  }

  @Patch('role')
  @ApiOperation({
    summary: "Change le rôle d'un ou plusieurs utilisateurs",
    description: 'Il reste toujours au moins un administrateur.',
  })
  @ApiOkResponse({ type: [AdminUserDto] })
  @ApiBadRequestResponse({ description: 'Rôle ou identifiants invalides' })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  @ApiConflictResponse({ description: 'Dernier administrateur' })
  updateRoles(@Body() dto: UpdateRolesDto): Promise<AdminUserDto[]> {
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
      const users = await tx.user.findMany({
        where: { id: { in: ids } },
        select: userSelect,
        orderBy: { createdAt: 'asc' },
      });
      return users.map(toAdminUser);
    });
  }
}

import {
  Body,
  Controller,
  Get,
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
import { AdminUserDto, UserEmailDto } from './dto/admin-user.dto.js';
import { UpdateRolesDto } from './dto/update-roles.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@ApiForbiddenResponse({ description: 'Réservé aux administrateurs' })
@Roles(Role.admin)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les utilisateurs (emails masqués)' })
  @ApiOkResponse({ type: [AdminUserDto] })
  list(): Promise<AdminUserDto[]> {
    return this.users.list();
  }

  @Get(':id/email')
  @ApiOperation({
    summary: "Affiche l'email d'un utilisateur",
    description: 'Un seul compte par requête.',
  })
  @ApiOkResponse({ type: UserEmailDto })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  revealEmail(@Param('id', ParseUUIDPipe) id: string): Promise<UserEmailDto> {
    return this.users.revealEmail(id);
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
    return this.users.updateRoles(dto.ids, dto.role);
  }
}

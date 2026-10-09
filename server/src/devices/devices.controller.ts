import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthContext } from '../auth/auth.guard.js';
import { CurrentAuth } from '../auth/decorators.js';
import { SessionDeviceDto } from '../auth/dto/auth-responses.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RenameDeviceDto } from './dto/rename-device.dto.js';

@ApiTags('devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly prisma: PrismaService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Renomme un de ses appareils' })
  @ApiOkResponse({ type: SessionDeviceDto })
  @ApiBadRequestResponse({ description: 'Nom invalide' })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  @ApiNotFoundResponse({ description: 'Appareil introuvable' })
  async rename(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RenameDeviceDto,
  ): Promise<SessionDeviceDto> {
    // updateMany filtre sur le propriétaire : on ne renomme jamais
    // l'appareil d'un autre utilisateur.
    const { count } = await this.prisma.device.updateMany({
      where: { id, userId: auth.userId },
      data: { name: dto.name },
    });
    if (count === 0) {
      throw new NotFoundException('Appareil introuvable');
    }
    return this.prisma.device.findUniqueOrThrow({
      where: { id },
      select: { id: true, name: true, type: true, model: true },
    });
  }
}

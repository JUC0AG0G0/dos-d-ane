import {
  Body,
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
import { DeviceDto } from './dto/device.dto.js';
import { RenameDeviceDto } from './dto/rename-device.dto.js';

@ApiTags('devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste ses appareils, du plus ancien au plus récent',
    description:
      'Avec leur capacité de capture et la session ouverte où chacun est actif.',
  })
  @ApiOkResponse({ type: [DeviceDto] })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  async list(@CurrentAuth() auth: AuthContext): Promise<DeviceDto[]> {
    const [{ deviceId: currentId }, devices] = await Promise.all([
      this.prisma.authSession.findUniqueOrThrow({
        where: { id: auth.sessionId },
        select: { deviceId: true },
      }),
      this.prisma.device.findMany({
        where: { userId: auth.userId },
        select: {
          id: true,
          name: true,
          type: true,
          model: true,
          captureEligible: true,
          captureStatus: true,
          // Au plus une : index unique partiel sur deviceId (endedAt null).
          deviceSessions: {
            where: { endedAt: null, analysisSession: { endedAt: null } },
            select: { analysisSessionId: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);
    return devices.map(({ deviceSessions, ...device }) => ({
      ...device,
      current: device.id === currentId,
      openSessionId: deviceSessions[0]?.analysisSessionId ?? null,
    }));
  }

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

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthContext } from '../auth/auth.guard.js';
import { CurrentAuth } from '../auth/decorators.js';
import { SessionDeviceDto } from '../auth/dto/auth-responses.dto.js';
import { DeviceType } from '../entities/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DevicesService } from './devices.service.js';
import { CreateRaspberryDto, DeviceKeyDto } from './dto/device-key.dto.js';
import { DeviceDto } from './dto/device.dto.js';
import { RenameDeviceDto } from './dto/rename-device.dto.js';

/** État de la clé d'un Raspberry Pi pour la liste (DeviceDto.keyStatus). */
const keyStatus = (
  type: string,
  keyHash: string | null,
  pairing: { id: string } | null,
): DeviceDto['keyStatus'] => {
  if (type !== DeviceType.Raspberry) return null;
  if (keyHash) return 'active';
  return pairing ? 'pending' : 'revoked';
};

@ApiTags('devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly devices: DevicesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Ajoute un Raspberry Pi au compte et renvoie sa clé',
    description:
      'La clé n’est affichée qu’une fois (le serveur n’en garde que l’empreinte) : la copier avec deviceId dans edge/.env du Pi (DOSDANE_APPAREIL, DOSDANE_CLE). Le Pi l’échange contre un JWT avec POST /auth/device-login.',
  })
  @ApiCreatedResponse({ type: DeviceKeyDto })
  @ApiBadRequestResponse({ description: 'Nom invalide' })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  createRaspberry(
    @CurrentAuth() auth: AuthContext,
    @Body() dto: CreateRaspberryDto,
  ): Promise<DeviceKeyDto> {
    return this.devices.createRaspberry(auth.userId, dto.name);
  }

  @Post(':id/key')
  @ApiOperation({
    summary: 'Nouvelle clé pour un de ses Raspberry Pi',
    description:
      'L’ancienne clé ne marche plus et les connexions ouvertes avec elle sont fermées. La nouvelle n’est affichée qu’une fois.',
  })
  @ApiCreatedResponse({ type: DeviceKeyDto })
  @ApiBadRequestResponse({ description: 'Pas un Raspberry Pi' })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  @ApiNotFoundResponse({ description: 'Appareil introuvable' })
  renewKey(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeviceKeyDto> {
    return this.devices.renewKey(auth.userId, id);
  }

  @Delete(':id/key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Révoque la clé d’un de ses Raspberry Pi',
    description:
      'Le Pi ne peut plus se connecter (Pi perdu, volé, donné) ; ses sessions de connexion sont fermées.',
  })
  @ApiNoContentResponse({ description: 'Clé révoquée' })
  @ApiBadRequestResponse({ description: 'Pas un Raspberry Pi' })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  @ApiNotFoundResponse({ description: 'Appareil introuvable' })
  revokeKey(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.devices.revokeKey(auth.userId, id);
  }

  @Get()
  @ApiOperation({
    summary: 'Liste ses appareils, du plus ancien au plus récent',
    description:
      'Avec leur capacité de capture et la session lancée où chacun capture.',
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
          // Au plus une : vérifié au lancement et à l'ajout (AnalysisService).
          deviceSessions: {
            where: {
              endedAt: null,
              analysisSession: { startedAt: { not: null }, endedAt: null },
            },
            select: { analysisSessionId: true },
            take: 1,
          },
          // Seulement savoir s'il y en a une : la clé ne quitte jamais la base.
          keyHash: true,
          pairing: { select: { id: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);
    return devices.map(({ deviceSessions, keyHash, pairing, ...device }) => ({
      ...device,
      current: device.id === currentId,
      openSessionId: deviceSessions[0]?.analysisSessionId ?? null,
      keyStatus: keyStatus(device.type, keyHash, pairing),
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

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthContext } from '../auth/auth.guard.js';
import { CurrentAuth } from '../auth/decorators.js';
import { AnalysisService } from './analysis.service.js';
import {
  AddSessionDeviceDto,
  CreateCaptureDto,
  StartAnalysisSessionDto,
} from './dto/analysis-inputs.dto.js';
import {
  AnalysisSessionDetailDto,
  AnalysisSessionSummaryDto,
  CaptureDto,
} from './dto/analysis-responses.dto.js';

@ApiTags('analysis-sessions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@Controller('analysis-sessions')
export class AnalysisSessionsController {
  constructor(private readonly analysis: AnalysisService) {}

  @Post()
  @ApiOperation({
    summary: 'Démarre une session d’analyse',
    description:
      'Les captures sont ensuite envoyées une par une sur POST /api/analysis-sessions/{id}/captures.',
  })
  @ApiCreatedResponse({ type: AnalysisSessionDetailDto })
  @ApiBadRequestResponse({ description: 'Corps invalide' })
  @ApiNotFoundResponse({ description: 'Appareil introuvable' })
  start(
    @CurrentAuth() auth: AuthContext,
    @Body() dto: StartAnalysisSessionDto,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.start(auth, dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Liste ses sessions d’analyse, de la plus récente à la plus ancienne',
  })
  @ApiOkResponse({ type: [AnalysisSessionSummaryDto] })
  list(@CurrentAuth() auth: AuthContext): Promise<AnalysisSessionSummaryDto[]> {
    return this.analysis.list(auth.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Détail d’une session : appareils et captures avec leur heure',
  })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  detail(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.detail(auth.userId, id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Arrête une session d’analyse' })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({ description: 'Session déjà terminée' })
  stop(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.stop(auth.userId, id);
  }

  @Post(':id/devices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ajoute un de ses appareils à une session en cours',
    description: 'Un appareil retiré peut être ajouté de nouveau.',
  })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiBadRequestResponse({ description: 'Identifiant invalide' })
  @ApiNotFoundResponse({ description: 'Session ou appareil introuvable' })
  @ApiConflictResponse({
    description: 'Session terminée ou appareil déjà dans la session',
  })
  addDevice(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddSessionDeviceDto,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.addDevice(auth.userId, id, dto.deviceId);
  }

  @Delete(':id/devices/:deviceId')
  @ApiOperation({
    summary: 'Retire un appareil d’une session en cours',
    description:
      'Ses captures restent dans la session ; il ne peut plus en envoyer.',
  })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiNotFoundResponse({
    description: 'Session introuvable ou appareil absent de la session',
  })
  @ApiConflictResponse({ description: 'Session terminée' })
  removeDevice(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.removeDevice(auth.userId, id, deviceId);
  }

  @Post(':id/captures')
  @ApiOperation({
    summary: 'Envoie une capture (points annotés) dans une session en cours',
    description:
      'L’appareil doit faire partie de la session. Seuls les points détectés sont envoyés.',
  })
  @ApiCreatedResponse({ type: CaptureDto })
  @ApiBadRequestResponse({
    description: 'Corps invalide ou point en dehors de l’image',
  })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({
    description: 'Session terminée ou appareil absent de la session',
  })
  addCapture(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCaptureDto,
  ): Promise<CaptureDto> {
    return this.analysis.addCapture(auth, id, dto);
  }
}

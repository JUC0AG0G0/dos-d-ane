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
  ApiNoContentResponse,
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
    summary: 'Crée une session d’analyse en préparation',
    description:
      'Les appareils se règlent ensuite avec /devices, puis la session se lance avec /start. Les captures sont envoyées une par une sur /captures tant qu’elle est en cours.',
  })
  @ApiCreatedResponse({ type: AnalysisSessionDetailDto })
  @ApiBadRequestResponse({
    description: 'Corps invalide ou appareil qui ne peut pas capturer (web)',
  })
  @ApiNotFoundResponse({ description: 'Appareil introuvable' })
  @ApiConflictResponse({
    description: 'Appareil déjà dans une autre session ouverte',
  })
  create(
    @CurrentAuth() auth: AuthContext,
    @Body() dto: StartAnalysisSessionDto,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.create(auth, dto);
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

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lance une session en préparation' })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({
    description: 'Session déjà lancée ou sans appareil',
  })
  start(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.start(auth.userId, id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Arrête une session en cours' })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({
    description: 'Session pas encore lancée ou déjà terminée',
  })
  stop(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.stop(auth.userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprime une session et toutes ses captures',
    description: 'Quel que soit son état.',
  })
  @ApiNoContentResponse({ description: 'Session supprimée' })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  remove(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.analysis.remove(auth.userId, id);
  }

  @Post(':id/devices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Ajoute un de ses appareils à une session en préparation ou en cours',
    description:
      'Seuls mobile, desktop et raspberry peuvent capturer. Un appareil n’est que dans une session ouverte à la fois ; un appareil retiré peut être ajouté de nouveau.',
  })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiBadRequestResponse({
    description: 'Identifiant invalide ou appareil qui ne peut pas capturer',
  })
  @ApiNotFoundResponse({ description: 'Session ou appareil introuvable' })
  @ApiConflictResponse({
    description:
      'Session terminée, appareil déjà dans cette session ou dans une autre session ouverte',
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
    summary: 'Retire un appareil d’une session en préparation ou en cours',
    description:
      'En cours, ses captures restent dans la session ; il ne peut plus en envoyer.',
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
    description:
      'Session pas encore lancée, terminée, ou appareil absent de la session',
  })
  addCapture(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCaptureDto,
  ): Promise<CaptureDto> {
    return this.analysis.addCapture(auth, id, dto);
  }
}

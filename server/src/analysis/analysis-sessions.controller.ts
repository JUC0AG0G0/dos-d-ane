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
  Query,
  Sse,
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
import type { Observable } from 'rxjs';
import type { AuthContext } from '../auth/auth.guard.js';
import { CurrentAuth } from '../auth/decorators.js';
import { AnalysisService } from './analysis.service.js';
import type { LiveMessage } from './live-states.js';
import {
  AddSessionDeviceDto,
  CapturePageQueryDto,
  CreateCaptureDto,
  ListSessionsQueryDto,
  StartAnalysisSessionDto,
  TimelineQueryDto,
} from './dto/analysis-inputs.dto.js';
import {
  AnalysisSessionDetailDto,
  AnalysisSessionSummaryDto,
  AnalysisStatsDto,
  CaptureDto,
  CapturePageDto,
  SessionTimelineDto,
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
    description:
      'Raspberry Pi sans clé (révoquée ou pas encore relevée) ou hors ligne',
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
      'Liste ses sessions d’analyse : préparations, puis de la plus récente à la plus ancienne',
    description:
      'status filtre par état (open : en préparation, en cours ou en pause) ; limit garde les premières.',
  })
  @ApiOkResponse({ type: [AnalysisSessionSummaryDto] })
  @ApiBadRequestResponse({ description: 'Statut ou limite invalide' })
  list(
    @CurrentAuth() auth: AuthContext,
    @Query() query: ListSessionsQueryDto,
  ): Promise<AnalysisSessionSummaryDto[]> {
    return this.analysis.list(
      auth.userId,
      query.status,
      query.limit ? Number(query.limit) : undefined,
    );
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Chiffres de la semaine (depuis lundi 00:00, heure de Paris)',
    description:
      'Sessions lancées, durée active et captures de la semaine ; sessions lancées la semaine précédente.',
  })
  @ApiOkResponse({ type: AnalysisStatsDto })
  stats(@CurrentAuth() auth: AuthContext): Promise<AnalysisStatsDto> {
    return this.analysis.stats(auth.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Détail d’une session : appareils, dernière capture et pauses (captures : /captures)',
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
    description:
      'Session déjà lancée, sans appareil, appareil déjà en capture dans une autre session, ou Raspberry Pi sans clé (un Pi hors ligne est accepté : il reçoit la session à sa reconnexion)',
  })
  start(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.start(auth.userId, id);
  }

  @Sse(':id/live')
  @ApiOperation({
    summary: 'Suit une session en direct (Server-Sent Events)',
    description:
      'Flux text/event-stream. À l’ouverture : event: status (setup, running, paused, ended) puis le dernier état du Pi. Ensuite : chaque état (event: state), chaque début ou fin d’alerte (event: alert, endedAt null au début), chaque changement de statut, et event: ping toutes les 30 s. Le flux se ferme après status ended ou deleted. Jamais stocké. EventSource n’envoie pas d’en-tête Authorization : lire le flux avec fetch.',
  })
  @ApiOkResponse({ description: 'Flux d’événements' })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  live(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Observable<LiveMessage>> {
    return this.analysis.live(auth.userId, id);
  }

  @Get(':id/captures')
  @ApiOperation({
    summary: 'Captures de la session, de la plus ancienne à la plus récente',
    description: 'Par pages : passer nextCursor en cursor pour la suite.',
  })
  @ApiOkResponse({ type: CapturePageDto })
  @ApiBadRequestResponse({ description: 'Curseur ou limite invalide' })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  captures(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: CapturePageQueryDto,
  ): Promise<CapturePageDto> {
    return this.analysis.captures(
      auth.userId,
      id,
      query.cursor,
      query.limit ? Number(query.limit) : 50,
    );
  }

  @Get(':id/timeline')
  @ApiOperation({
    summary: 'Nombre de captures par tranche de temps (10 min par défaut)',
    description:
      'Du début à la fin (ou maintenant) de la session, tranches vides comprises, avec les pauses.',
  })
  @ApiOkResponse({ type: SessionTimelineDto })
  @ApiBadRequestResponse({ description: 'Taille de tranche invalide' })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  timeline(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: TimelineQueryDto,
  ): Promise<SessionTimelineDto> {
    return this.analysis.timeline(
      auth.userId,
      id,
      query.bucketMinutes ? Number(query.bucketMinutes) : 10,
    );
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Met en pause une session en cours',
    description:
      'Toute la session arrête de capturer : les captures sont refusées jusqu’à la reprise. Le temps de pause n’est pas compté dans la durée.',
  })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({
    description: 'Session en préparation, déjà en pause ou terminée',
  })
  pause(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.pause(auth.userId, id);
  }

  @Post(':id/resume')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reprend une session en pause' })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({ description: 'Session pas en pause' })
  resume(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnalysisSessionDetailDto> {
    return this.analysis.resume(auth.userId, id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Arrête une session en cours ou en pause',
    description: 'Une pause en cours est fermée à l’heure de l’arrêt.',
  })
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
      'Ajoute un de ses appareils à une session en préparation, en cours ou en pause',
    description:
      'Seuls mobile, desktop et raspberry peuvent capturer. Un appareil peut être dans plusieurs sessions en préparation, mais ne capture que dans une session lancée à la fois ; un appareil retiré peut être ajouté de nouveau.',
  })
  @ApiOkResponse({ type: AnalysisSessionDetailDto })
  @ApiBadRequestResponse({
    description:
      'Identifiant invalide ou appareil qui ne peut pas capturer (web)',
  })
  @ApiNotFoundResponse({ description: 'Session ou appareil introuvable' })
  @ApiConflictResponse({
    description:
      'Session terminée, appareil déjà dans cette session, en capture dans une autre session lancée, ou Raspberry Pi sans clé ou hors ligne',
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
    summary:
      'Retire un appareil d’une session en préparation, en cours ou en pause',
    description:
      'Une fois lancée, ses captures restent dans la session ; il ne peut plus en envoyer.',
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
      'Session pas encore lancée, en pause (ou capture prise pendant une pause), terminée, ou appareil absent de la session',
  })
  addCapture(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCaptureDto,
  ): Promise<CaptureDto> {
    return this.analysis.addCapture(auth, id, dto);
  }
}

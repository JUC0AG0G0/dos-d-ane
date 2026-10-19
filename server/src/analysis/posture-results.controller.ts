import {
  Body,
  Controller,
  Get,
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
import {
  CreatePostureEventDto,
  CreatePostureSummaryDto,
  PostureEventDto,
  PostureSummaryDto,
} from './dto/posture-results.dto.js';
import { PostureResultsService } from './posture-results.service.js';

@ApiTags('analysis-sessions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@Controller('analysis-sessions')
export class PostureResultsController {
  constructor(private readonly results: PostureResultsService) {}

  @Post(':id/events')
  @ApiOperation({
    summary: 'Envoie le début ou la fin d’une alerte de posture (Pi)',
    description:
      'start crée l’alerte, end la complète (ou la crée si le début s’est perdu). Un message renvoyé avec le même clientId ne crée pas de doublon : la ligne existante est renvoyée. Accepté aussi sur une session terminée (envoi après une coupure).',
  })
  @ApiCreatedResponse({ type: PostureEventDto })
  @ApiBadRequestResponse({
    description: 'Corps invalide ou dates incohérentes',
  })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({
    description: 'Session pas encore lancée ou appareil absent de la session',
  })
  addEvent(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePostureEventDto,
  ): Promise<PostureEventDto> {
    return this.results.addEvent(auth, id, dto);
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Alertes de posture de la session, dans l’ordre' })
  @ApiOkResponse({ type: [PostureEventDto] })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  listEvents(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostureEventDto[]> {
    return this.results.listEvents(auth.userId, id);
  }

  @Post(':id/summaries')
  @ApiOperation({
    summary: 'Envoie le résumé d’une période (Pi)',
    description:
      'Un résumé renvoyé avec le même clientId ne crée pas de doublon. Accepté aussi sur une session terminée.',
  })
  @ApiCreatedResponse({ type: PostureSummaryDto })
  @ApiBadRequestResponse({
    description: 'Corps invalide ou période incohérente',
  })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  @ApiConflictResponse({
    description: 'Session pas encore lancée ou appareil absent de la session',
  })
  addSummary(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePostureSummaryDto,
  ): Promise<PostureSummaryDto> {
    return this.results.addSummary(auth, id, dto);
  }

  @Get(':id/summaries')
  @ApiOperation({ summary: 'Résumés de la session, dans l’ordre' })
  @ApiOkResponse({ type: [PostureSummaryDto] })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  listSummaries(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostureSummaryDto[]> {
    return this.results.listSummaries(auth.userId, id);
  }
}

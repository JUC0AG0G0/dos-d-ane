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
import { CreateCaptureDto } from './dto/analysis-inputs.dto.js';
import { CaptureDto } from './dto/analysis-responses.dto.js';

@ApiTags('captures')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@Controller('captures')
export class CapturesController {
  constructor(private readonly analysis: AnalysisService) {}

  @Post()
  @ApiOperation({
    summary: 'Envoie une capture seule',
    description:
      'Crée une session d’analyse d’une seule capture, déjà terminée.',
  })
  @ApiCreatedResponse({ type: CaptureDto })
  @ApiBadRequestResponse({
    description: 'Corps invalide ou point en dehors de l’image',
  })
  @ApiNotFoundResponse({ description: 'Appareil introuvable' })
  create(
    @CurrentAuth() auth: AuthContext,
    @Body() dto: CreateCaptureDto,
  ): Promise<CaptureDto> {
    return this.analysis.addStandaloneCapture(auth, dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Affiche une capture : points annotés et taille de l’image',
  })
  @ApiOkResponse({ type: CaptureDto })
  @ApiNotFoundResponse({ description: 'Capture introuvable' })
  findOne(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CaptureDto> {
    return this.analysis.getCapture(auth.userId, id);
  }
}

import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TRANSFORM_PIPE } from './advice-validation.js';
import { ExerciseQueryDto } from './dto/advice-inputs.dto.js';
import {
  ExerciseDto,
  ExerciseListDto,
  PainZonesDto,
  PostureTipDto,
} from './dto/advice-responses.dto.js';
import { ExercisesService } from './exercises.service.js';
import { PainZonesService } from './pain-zones.service.js';
import { PostureTipsService } from './posture-tips.service.js';

/** Pages Conseils : contenu publié (et réglages affichés) seulement. */
@ApiTags('advice')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@UsePipes(TRANSFORM_PIPE)
@Controller('advice')
export class AdviceController {
  constructor(
    private readonly tips: PostureTipsService,
    private readonly exercises: ExercisesService,
    private readonly zones: PainZonesService,
  ) {}

  @Get('posture-tips')
  @ApiOperation({
    summary: 'Réglages du poste affichés, dans l’ordre (Bien s’installer)',
    description: 'Le repère n du schéma est le n-ième réglage de la liste.',
  })
  @ApiOkResponse({ type: [PostureTipDto] })
  postureTips(): Promise<PostureTipDto[]> {
    return this.tips.listVisible();
  }

  @Get('exercises')
  @ApiOperation({
    summary: 'Exercices publiés, filtrés par type et partie du corps',
  })
  @ApiOkResponse({ type: ExerciseListDto })
  exerciseList(@Query() query: ExerciseQueryDto): Promise<ExerciseListDto> {
    return this.exercises.listPublished(query);
  }

  @Get('exercises/:id')
  @ApiOperation({ summary: 'Détail d’un exercice publié, avec ses étapes' })
  @ApiOkResponse({ type: ExerciseDto })
  @ApiNotFoundResponse({ description: 'Exercice introuvable ou brouillon' })
  exercise(@Param('id', ParseUUIDPipe) id: string): Promise<ExerciseDto> {
    return this.exercises.getPublished(id);
  }

  @Get('pain-zones')
  @ApiOperation({
    summary: 'Zones de douleur publiées et message « Quand consulter »',
  })
  @ApiOkResponse({ type: PainZonesDto })
  painZones(): Promise<PainZonesDto> {
    return this.zones.listPublished();
  }
}

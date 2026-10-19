import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators.js';
import { Role } from '../entities/index.js';
import { TRANSFORM_PIPE } from './advice-validation.js';
import {
  AdminExerciseQueryDto,
  CreateExerciseDto,
  CreatePainZoneDto,
  OrderDto,
  UpdateAdviceSettingDto,
  UpdateExerciseDto,
  UpdatePainZoneDto,
  UpdatePostureTipDto,
} from './dto/advice-inputs.dto.js';
import {
  AdminExerciseDto,
  AdminPainZoneDto,
  AdminPainZonesDto,
  AdminPostureTipDto,
  AdviceSettingDto,
} from './dto/advice-responses.dto.js';
import { ExercisesService } from './exercises.service.js';
import { PainZonesService } from './pain-zones.service.js';
import { PostureTipsService } from './posture-tips.service.js';

/** Administration › Conseils et exercices : tout le contenu, brouillons compris. */
const AdminAdvice =
  (path: string): ClassDecorator =>
  (target) => {
    ApiTags('admin · advice')(target);
    ApiBearerAuth()(target);
    ApiUnauthorizedResponse({ description: 'Non connecté' })(target);
    ApiForbiddenResponse({ description: 'Réservé aux administrateurs' })(
      target,
    );
    Roles(Role.admin)(target);
    UsePipes(TRANSFORM_PIPE)(target);
    Controller(`admin/advice/${path}`)(target);
  };

@AdminAdvice('exercises')
export class AdminExercisesController {
  constructor(private readonly exercises: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste les exercices, brouillons compris' })
  @ApiOkResponse({ type: [AdminExerciseDto] })
  list(@Query() query: AdminExerciseQueryDto): Promise<AdminExerciseDto[]> {
    return this.exercises.adminList(query);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un exercice (brouillon par défaut)' })
  @ApiCreatedResponse({ type: AdminExerciseDto })
  @ApiBadRequestResponse({
    description: 'Aucun type, ou publié sans étape, ou média introuvable',
  })
  create(@Body() dto: CreateExerciseDto): Promise<AdminExerciseDto> {
    return this.exercises.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifie un exercice',
    description:
      'Les étapes envoyées remplacent les anciennes. Repassé en brouillon, l’exercice est retiré des zones de douleur.',
  })
  @ApiOkResponse({ type: AdminExerciseDto })
  @ApiBadRequestResponse({
    description: 'Aucun type, ou publié sans étape, ou média introuvable',
  })
  @ApiNotFoundResponse({ description: 'Exercice introuvable' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExerciseDto,
  ): Promise<AdminExerciseDto> {
    return this.exercises.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprime un exercice, le retire des zones et efface son média',
  })
  @ApiNoContentResponse({ description: 'Exercice supprimé' })
  @ApiNotFoundResponse({ description: 'Exercice introuvable' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.exercises.remove(id);
  }
}

@AdminAdvice('posture-tips')
export class AdminPostureTipsController {
  constructor(private readonly tips: PostureTipsService) {}

  @Get()
  @ApiOperation({ summary: 'Les 6 réglages du poste, masqués compris' })
  @ApiOkResponse({ type: [AdminPostureTipDto] })
  list(): Promise<AdminPostureTipDto[]> {
    return this.tips.adminList();
  }

  @Put('order')
  @ApiOperation({
    summary: 'Change l’ordre des réglages (glisser-déposer)',
    description: 'ids : les 6 identifiants, dans le nouvel ordre.',
  })
  @ApiOkResponse({ type: [AdminPostureTipDto] })
  @ApiBadRequestResponse({ description: 'La liste n’est pas exactement les 6' })
  reorder(@Body() dto: OrderDto): Promise<AdminPostureTipDto[]> {
    return this.tips.reorder(dto.ids);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifie les textes, la source ou l’affichage d’un réglage',
  })
  @ApiOkResponse({ type: AdminPostureTipDto })
  @ApiBadRequestResponse({ description: 'Source incomplète' })
  @ApiNotFoundResponse({ description: 'Réglage introuvable' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostureTipDto,
  ): Promise<AdminPostureTipDto> {
    return this.tips.update(id, dto);
  }

  @Post(':id/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rétablit les textes et la source par défaut' })
  @ApiOkResponse({ type: AdminPostureTipDto })
  @ApiNotFoundResponse({ description: 'Réglage introuvable' })
  reset(@Param('id', ParseUUIDPipe) id: string): Promise<AdminPostureTipDto> {
    return this.tips.reset(id);
  }
}

@AdminAdvice('pain-zones')
export class AdminPainZonesController {
  constructor(private readonly zones: PainZonesService) {}

  @Get()
  @ApiOperation({
    summary:
      'Zones de douleur, brouillons compris, et message « Quand consulter »',
  })
  @ApiOkResponse({ type: AdminPainZonesDto })
  list(): Promise<AdminPainZonesDto> {
    return this.zones.adminList();
  }

  @Post()
  @ApiOperation({
    summary: 'Crée une zone (brouillon par défaut), placée en dernier',
  })
  @ApiCreatedResponse({ type: AdminPainZoneDto })
  @ApiBadRequestResponse({
    description:
      'Plus de 3 exercices, exercice non publié ou source incomplète',
  })
  create(@Body() dto: CreatePainZoneDto): Promise<AdminPainZoneDto> {
    return this.zones.create(dto);
  }

  @Put('order')
  @ApiOperation({ summary: 'Change l’ordre des zones (glisser-déposer)' })
  @ApiOkResponse({ type: AdminPainZonesDto })
  @ApiBadRequestResponse({
    description: 'La liste ne contient pas toutes les zones',
  })
  reorder(@Body() dto: OrderDto): Promise<AdminPainZonesDto> {
    return this.zones.reorder(dto.ids);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifie une zone',
    description:
      'Les listes envoyées (helps, avoid, exerciseIds) remplacent les anciennes.',
  })
  @ApiOkResponse({ type: AdminPainZoneDto })
  @ApiBadRequestResponse({
    description:
      'Plus de 3 exercices, exercice non publié ou source incomplète',
  })
  @ApiNotFoundResponse({ description: 'Zone introuvable' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePainZoneDto,
  ): Promise<AdminPainZoneDto> {
    return this.zones.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprime une zone' })
  @ApiNoContentResponse({ description: 'Zone supprimée' })
  @ApiNotFoundResponse({ description: 'Zone introuvable' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.zones.remove(id);
  }
}

@AdminAdvice('settings')
export class AdminAdviceSettingsController {
  constructor(private readonly zones: PainZonesService) {}

  @Put('when-to-see-doctor')
  @ApiOperation({
    summary: 'Modifie le message « Quand consulter un médecin »',
    description: 'Affiché en haut de En cas de douleur, pour toutes les zones.',
  })
  @ApiOkResponse({ type: AdviceSettingDto })
  update(@Body() dto: UpdateAdviceSettingDto): Promise<AdviceSettingDto> {
    return this.zones.setWhenToSeeDoctor(dto.text);
  }
}

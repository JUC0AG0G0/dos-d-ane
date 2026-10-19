import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthContext } from '../auth/auth.guard.js';
import { CurrentAuth, Roles } from '../auth/decorators.js';
import { Role } from '../entities/index.js';
import { AdminMediaDto, MediaDto, MediaUploadDto } from './dto/media.dto.js';
import {
  MEDIA_MAX_BYTES,
  type UploadedFile as UploadedMediaFile,
} from './media-file.js';
import { MediaService } from './media.service.js';

@ApiTags('advice')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@Controller('advice/media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get(':id')
  @Header('Cache-Control', 'private, max-age=86400, immutable')
  @Header('X-Content-Type-Options', 'nosniff')
  @ApiOperation({
    summary: 'Sert le fichier d’un média (GIF, PNG ou MP4)',
    description:
      'Le stockage S3 n’est jamais exposé : le serveur relaie le fichier.',
  })
  @ApiOkResponse({ description: 'Contenu du fichier' })
  @ApiNotFoundResponse({ description: 'Média introuvable' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StreamableFile> {
    return this.media.stream(id);
  }
}

@ApiTags('admin · advice')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Non connecté' })
@ApiForbiddenResponse({ description: 'Réservé aux administrateurs' })
@Roles(Role.admin)
@Controller('admin/advice/media')
export class AdminMediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  @ApiOperation({
    summary:
      'Liste tous les médias stockés, avec les contenus qui les utilisent',
  })
  @ApiOkResponse({ type: [AdminMediaDto] })
  list(): Promise<AdminMediaDto[]> {
    return this.media.list();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprime un média inutilisé (fichier compris)' })
  @ApiNoContentResponse({ description: 'Média supprimé' })
  @ApiNotFoundResponse({ description: 'Média introuvable' })
  @ApiConflictResponse({ description: 'Média encore utilisé' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.media.remove(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MEDIA_MAX_BYTES, files: 1 },
    }),
  )
  @ApiOperation({
    summary: 'Envoie un média',
    description:
      'Type vérifié d’après le contenu ; métadonnées (EXIF, XMP, commentaires) retirées. Renvoie l’id à placer dans mediaId.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MediaUploadDto })
  @ApiCreatedResponse({ type: MediaDto })
  @ApiBadRequestResponse({
    description: 'Fichier absent ou format non accepté',
  })
  @ApiPayloadTooLargeResponse({ description: 'Plus de 5 Mo' })
  upload(
    @CurrentAuth() auth: AuthContext,
    @UploadedFile() file: UploadedMediaFile | undefined,
  ): Promise<MediaDto> {
    return this.media.upload(file, auth.userId);
  }
}

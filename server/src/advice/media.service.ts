import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { MediaDto } from './dto/media.dto.js';
import { MediaStorageService } from './media-storage.service.js';
import {
  MEDIA_EXTENSIONS,
  readMediaFile,
  type UploadedFile,
} from './media-file.js';

const mediaSelect = {
  id: true,
  mimeType: true,
  sizeBytes: true,
  width: true,
  height: true,
} as const;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: MediaStorageService,
  ) {}

  /** Vérifie le format d'après le contenu, retire les métadonnées et stocke le fichier. */
  async upload(
    file: UploadedFile | undefined,
    uploadedById: string,
  ): Promise<MediaDto> {
    if (!file) {
      throw new BadRequestException('Aucun fichier envoyé (champ « file »)');
    }
    const media = readMediaFile(file.buffer);
    if (!media) {
      throw new BadRequestException('Format non accepté : GIF, PNG ou MP4');
    }
    const storageKey = `media/${randomUUID()}.${MEDIA_EXTENSIONS[media.mimeType]}`;
    await this.storage.put(storageKey, media.data, media.mimeType);
    return this.prisma.media.create({
      data: {
        storageKey,
        mimeType: media.mimeType,
        sizeBytes: media.data.length,
        width: media.width,
        height: media.height,
        uploadedById,
      },
      select: mediaSelect,
    });
  }

  async stream(id: string): Promise<StreamableFile> {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Média introuvable');
    const body = await this.storage.get(media.storageKey).catch(() => {
      throw new NotFoundException('Média introuvable');
    });
    return new StreamableFile(body, {
      type: media.mimeType,
      length: media.sizeBytes,
      disposition: 'inline',
    });
  }

  /** Vérifie qu'un média existe avant de le rattacher à un contenu. */
  async assertExists(id: string): Promise<void> {
    const count = await this.prisma.media.count({ where: { id } });
    if (!count) throw new BadRequestException('Média introuvable');
  }

  /**
   * Supprime un média qui n'est plus utilisé par aucun exercice ni réglage
   * (après un remplacement, un retrait ou la suppression de l'exercice).
   */
  async removeIfUnused(id: string | null | undefined): Promise<void> {
    if (!id) return;
    const media = await this.prisma.media.findUnique({
      where: { id },
      select: {
        storageKey: true,
        _count: { select: { exercises: true, postureTips: true } },
      },
    });
    if (!media || media._count.exercises || media._count.postureTips) return;
    await this.prisma.media.delete({ where: { id } });
    await this.storage.delete(media.storageKey).catch(() => undefined);
  }
}

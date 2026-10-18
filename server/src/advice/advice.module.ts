import { Module } from '@nestjs/common';
import { AdminMediaController, MediaController } from './media.controller.js';
import { MediaStorageService } from './media-storage.service.js';
import { MediaService } from './media.service.js';

/** Conseils : réglages du poste, exercices, repères douleur et leurs médias. */
@Module({
  controllers: [MediaController, AdminMediaController],
  providers: [MediaStorageService, MediaService],
})
export class AdviceModule {}

import { Module } from '@nestjs/common';
import {
  AdminAdviceSettingsController,
  AdminExercisesController,
  AdminPainZonesController,
  AdminPostureTipsController,
} from './admin-advice.controller.js';
import { AdviceController } from './advice.controller.js';
import { ExercisesService } from './exercises.service.js';
import { AdminMediaController, MediaController } from './media.controller.js';
import { MediaStorageService } from './media-storage.service.js';
import { MediaService } from './media.service.js';
import { PainZonesService } from './pain-zones.service.js';
import { PostureTipsService } from './posture-tips.service.js';

/**
 * Conseils : réglages du poste, exercices, repères douleur et leurs médias.
 * Lecture pour tout utilisateur connecté (/api/advice), écriture réservée aux
 * admins (/api/admin/advice).
 */
@Module({
  controllers: [
    AdviceController,
    MediaController,
    AdminExercisesController,
    AdminPostureTipsController,
    AdminPainZonesController,
    AdminAdviceSettingsController,
    AdminMediaController,
  ],
  providers: [
    MediaStorageService,
    MediaService,
    ExercisesService,
    PostureTipsService,
    PainZonesService,
  ],
})
export class AdviceModule {}

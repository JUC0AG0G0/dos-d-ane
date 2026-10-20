import { Module } from '@nestjs/common';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { AnalysisModule } from '../analysis/analysis.module.js';
import type { AuthenticatedRequest } from '../auth/auth.guard.js';
import { DevicesController } from './devices.controller.js';
import { DevicesService } from './devices.service.js';
import { PairingController } from './pairing.controller.js';
import { PairingService } from './pairing.service.js';

@Module({
  imports: [
    AnalysisModule,
    // Limites de l'appairage par code (compteurs en mémoire : une seule instance).
    // Appliquées seulement là où PairingController met ThrottlerGuard.
    ThrottlerModule.forRoot({
      errorMessage: 'Trop d’essais : réessayez dans quelques minutes',
      throttlers: [
        // Un Pi en attente demande toutes les 5 s ; plusieurs Pi d'un même
        // réseau partagent une adresse. Au-delà : quelqu'un remplit la table.
        { name: 'pairingPoll', ttl: minutes(1), limit: 60 },
        // Deviner un code : par adresse (plusieurs comptes) et par compte
        // (plusieurs adresses).
        { name: 'pairingClaimIp', ttl: minutes(15), limit: 20 },
        {
          name: 'pairingClaimAccount',
          ttl: minutes(15),
          limit: 5,
          getTracker: (req) =>
            (req as AuthenticatedRequest).auth?.userId ??
            String((req as AuthenticatedRequest).ip),
        },
      ],
    }),
  ],
  // PairingController d'abord : « pairing » ne doit pas être pris pour un :id.
  controllers: [PairingController, DevicesController],
  providers: [DevicesService, PairingService],
})
export class DevicesModule {}

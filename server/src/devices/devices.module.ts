import { Module } from '@nestjs/common';
import { AnalysisModule } from '../analysis/analysis.module.js';
import { DevicesController } from './devices.controller.js';
import { DevicesService } from './devices.service.js';
import { PairingController } from './pairing.controller.js';
import { PairingService } from './pairing.service.js';

@Module({
  imports: [AnalysisModule],
  // PairingController d'abord : « pairing » ne doit pas être pris pour un :id.
  controllers: [PairingController, DevicesController],
  providers: [DevicesService, PairingService],
})
export class DevicesModule {}

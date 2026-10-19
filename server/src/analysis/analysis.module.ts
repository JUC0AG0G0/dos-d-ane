import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AnalysisSessionsController } from './analysis-sessions.controller.js';
import { AnalysisService } from './analysis.service.js';
import { CapturesController } from './captures.controller.js';
import { DeviceConnections } from './device-connections.js';
import { DevicesGateway } from './devices.gateway.js';
import { LiveStates } from './live-states.js';
import { PostureResultsController } from './posture-results.controller.js';
import { PostureResultsService } from './posture-results.service.js';

@Module({
  imports: [AuthModule],
  controllers: [
    AnalysisSessionsController,
    CapturesController,
    PostureResultsController,
  ],
  providers: [
    AnalysisService,
    DeviceConnections,
    LiveStates,
    DevicesGateway,
    PostureResultsService,
  ],
})
export class AnalysisModule {}

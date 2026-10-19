import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AnalysisSessionsController } from './analysis-sessions.controller.js';
import { AnalysisService } from './analysis.service.js';
import { CapturesController } from './captures.controller.js';
import { DeviceConnections } from './device-connections.js';
import { DevicesGateway } from './devices.gateway.js';
import { LiveStates } from './live-states.js';

@Module({
  imports: [AuthModule],
  controllers: [AnalysisSessionsController, CapturesController],
  providers: [AnalysisService, DeviceConnections, LiveStates, DevicesGateway],
})
export class AnalysisModule {}

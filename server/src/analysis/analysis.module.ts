import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AnalysisSessionsController } from './analysis-sessions.controller.js';
import { AnalysisService } from './analysis.service.js';
import { CapturesController } from './captures.controller.js';
import { DevicesGateway } from './devices.gateway.js';

@Module({
  imports: [AuthModule],
  controllers: [AnalysisSessionsController, CapturesController],
  providers: [AnalysisService, DevicesGateway],
})
export class AnalysisModule {}

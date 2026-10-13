import { Module } from '@nestjs/common';
import { AnalysisSessionsController } from './analysis-sessions.controller.js';
import { AnalysisService } from './analysis.service.js';
import { CapturesController } from './captures.controller.js';

@Module({
  controllers: [AnalysisSessionsController, CapturesController],
  providers: [AnalysisService],
})
export class AnalysisModule {}

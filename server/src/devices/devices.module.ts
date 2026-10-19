import { Module } from '@nestjs/common';
import { AnalysisModule } from '../analysis/analysis.module.js';
import { DevicesController } from './devices.controller.js';
import { DevicesService } from './devices.service.js';

@Module({
  imports: [AnalysisModule],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}

import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateMeasurementDto } from './measurement.dto.js';
import { MeasurementsService } from './measurements.service.js';
import { SensorKeyGuard } from './sensor-key.guard.js';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly service: MeasurementsService) {}

  /** Point d'entrée unique des capteurs. */
  @Post()
  @UseGuards(SensorKeyGuard)
  create(@Body() dto: CreateMeasurementDto) {
    return this.service.create(dto);
  }

  // TODO: protéger par une authentification administrateur.
  @Get()
  findLatest(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('sensorType') sensorType?: string,
  ) {
    return this.service.findLatest(Math.min(limit, 1000), sensorType);
  }
}

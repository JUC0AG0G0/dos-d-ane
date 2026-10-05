import { Injectable } from '@nestjs/common';
import { CreateMeasurementDto, Measurement } from './measurement.dto.js';

/**
 * Stockage en mémoire pour le POC : il sera remplacé par une base de données
 * (DATABASE_URL est déjà prévu dans la configuration).
 */
@Injectable()
export class MeasurementsService {
  private readonly items: Measurement[] = [];
  private nextId = 1;
  private static readonly MAX_ITEMS = 10_000;

  create(dto: CreateMeasurementDto): Measurement {
    const measurement: Measurement = {
      ...dto,
      id: this.nextId++,
      receivedAt: new Date().toISOString(),
    };
    this.items.push(measurement);
    if (this.items.length > MeasurementsService.MAX_ITEMS) {
      this.items.shift();
    }
    return measurement;
  }

  findLatest(limit = 100, sensorType?: string): Measurement[] {
    return this.items
      .filter((m) => !sensorType || m.sensorType === sensorType)
      .slice(-limit)
      .reverse();
  }
}

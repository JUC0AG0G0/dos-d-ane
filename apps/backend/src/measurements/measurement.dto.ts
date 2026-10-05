import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

/**
 * Format commun à tous les capteurs (contrat « plug and play »).
 * Un nouveau capteur n'a pas besoin de modifier le backend : il choisit un
 * `sensorType` et place ses grandeurs dans `values`.
 * RGPD : `values` ne doit contenir que des données dérivées (angles, scores),
 * jamais d'image ni de donnée brute identifiante.
 */
export class CreateMeasurementDto {
  /** Identifiant de l'appareil (ex. "rpi-salle-204-imu-1"). */
  @IsString()
  @IsNotEmpty()
  sensorId: string;

  /** Type de capteur en minuscules (ex. "imu", "tof", "camera", "fake"). */
  @IsString()
  @Matches(/^[a-z][a-z0-9_-]*$/)
  sensorType: string;

  /** Date ISO 8601 de la mesure, côté capteur. */
  @IsDateString()
  timestamp: string;

  /** Grandeurs mesurées, libres selon le capteur. */
  @IsObject()
  @Type(() => Object)
  values: Record<string, number | string | boolean>;

  /** Identifiant pseudonymisé de la session utilisateur, jamais un nom. */
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export interface Measurement extends CreateMeasurementDto {
  id: number;
  receivedAt: string;
}

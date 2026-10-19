import {
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

/** Posture vue sur l'image (vue de profil, audit §8) ; null si l'image n'est pas jugée. */
export const LIVE_POSTURES = [
  'GOOD',
  'FORWARD_HEAD',
  'TRUNK_FORWARD',
  'TRUNK_BACKWARD',
] as const;
export type LivePosture = (typeof LIVE_POSTURES)[number];

/** Couleur de l'alerte en cours ; ignored : image mal vue ; absent : personne devant la caméra. */
export const LIVE_COLORS = [
  'green',
  'orange',
  'red',
  'ignored',
  'absent',
] as const;
export type LiveColor = (typeof LIVE_COLORS)[number];

/**
 * État en direct envoyé par le Pi à chaque image (message `state`, contrat
 * edge/docs/liaison-serveur.md §3). Relayé, jamais stocké. Deux angles
 * seulement : un champ en plus (points du corps…) fait refuser le message.
 */
export class LiveStateDto {
  @IsUUID('all', { message: 'sessionId invalide' })
  sessionId: string;

  /** Heure de l'image sur le Pi (ISO 8601). */
  @IsISO8601({ strict: true }, { message: 'at doit être une date ISO 8601' })
  at: string;

  @IsIn(LIVE_COLORS, { message: 'color inconnue' })
  color: LiveColor;

  @ValidateIf((_, value) => value !== null)
  @IsIn(LIVE_POSTURES, { message: 'posture inconnue' })
  posture: LivePosture | null;

  /** Angle de la tête en degrés (≈ 90 = droite), null si l'image n'est pas jugée. */
  @ValidateIf((_, value) => value !== null)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  headAngle: number | null;

  /** Angle du tronc en degrés (0 = droit, > 0 penché en avant), null si l'image n'est pas jugée. */
  @ValidateIf((_, value) => value !== null)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  trunkAngle: number | null;

  /** Score de la période en cours (% du temps en bonne posture), null tant que rien n'est suivi. */
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(0)
  @Max(100)
  score: number | null;
}

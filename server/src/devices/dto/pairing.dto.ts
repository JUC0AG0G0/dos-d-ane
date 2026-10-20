import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PAIRING_SECRET_PATTERN } from '../pairing-code.js';

export class PollPairingDto {
  @ApiProperty({
    example: 'K7F29QM4T',
    description: 'Code de l’étiquette du Pi (DOSDANE_CODE)',
  })
  @IsString()
  @MaxLength(20)
  code: string;

  @ApiProperty({
    example: 'ps_3q2-7wE…',
    description:
      'Secret de relève du Pi (DOSDANE_SECRET_APPAIRAGE), connu de lui seul',
  })
  @Matches(PAIRING_SECRET_PATTERN, { message: 'secret invalide' })
  secret: string;
}

export class ClaimPairingDto {
  @ApiProperty({
    example: 'K7F-29Q-M4T',
    description:
      'Code imprimé sur l’étiquette du Pi ; casse, tirets et espaces ignorés',
  })
  @IsString()
  @MaxLength(20)
  code: string;

  @ApiPropertyOptional({
    example: 'Pi du bureau',
    minLength: 2,
    maxLength: 100,
    default: 'Raspberry Pi',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2, { message: 'Le nom doit faire au moins 2 caractères' })
  @MaxLength(100)
  name?: string;
}

export class PairingStatusDto {
  @ApiProperty({
    enum: ['waiting', 'paired'],
    description:
      'waiting : code pas encore validé, redemander dans 5 s ; paired : deviceId et key à enregistrer',
  })
  status: 'waiting' | 'paired';

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Avec paired : DOSDANE_APPAREIL',
  })
  deviceId?: string;

  @ApiPropertyOptional({
    example: 'dk_3q2-7wE…',
    description:
      'Avec paired : DOSDANE_CLE. Donnée une seule fois : le serveur n’en garde que l’empreinte.',
  })
  key?: string;
}

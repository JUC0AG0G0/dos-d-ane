import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRaspberryDto {
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

export class DeviceKeyDto {
  @ApiProperty({
    format: 'uuid',
    description: 'À mettre dans DOSDANE_APPAREIL sur le Pi',
  })
  deviceId: string;

  @ApiProperty({ example: 'Raspberry Pi' })
  name: string;

  @ApiProperty({
    example: 'dk_3q2-7wE…',
    description:
      'À mettre dans DOSDANE_CLE sur le Pi. Affichée une seule fois : le serveur n’en garde que l’empreinte.',
  })
  key: string;

  @ApiProperty()
  keyCreatedAt: Date;
}

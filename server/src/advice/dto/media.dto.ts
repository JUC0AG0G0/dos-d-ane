import { ApiProperty } from '@nestjs/swagger';

export class MediaDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ enum: ['image/gif', 'image/png', 'video/mp4'] })
  mimeType: string;

  @ApiProperty({ example: 482133 })
  sizeBytes: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'null pour une vidéo',
  })
  width: number | null;

  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'null pour une vidéo',
  })
  height: number | null;
}

export class MediaUsageDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Rentrer le menton' })
  title: string;
}

/** Média stocké, avec les contenus qui l'utilisent (page Administration › Médias). */
export class AdminMediaDto extends MediaDto {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    type: String,
    nullable: true,
    description:
      'Nom d’affichage de l’admin qui l’a envoyé ; null si son compte a été supprimé',
  })
  uploadedBy: string | null;

  @ApiProperty({ type: [MediaUsageDto] })
  exercises: MediaUsageDto[];

  @ApiProperty({ type: [MediaUsageDto] })
  postureTips: MediaUsageDto[];
}

export class MediaUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'GIF, PNG ou MP4, 5 Mo max',
  })
  file: unknown;
}

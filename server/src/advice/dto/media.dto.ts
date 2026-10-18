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

export class MediaUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'GIF, PNG ou MP4, 5 Mo max',
  })
  file: unknown;
}

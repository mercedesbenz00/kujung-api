import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BoolString {
  YES = 'y',
  NO = 'n',
}

export class FilesUploadDto {
  // @IsArray()
  // @ApiProperty({ description: 'Files to upload' })
  // files: Express.Multer.File[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'File category. For example: banner etc',
  })
  file_category?: string;

  @IsEnum(BoolString)
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'Enable/Disable thumbnail generation, y: generation, n: no generation',
  })
  thumb_yb?: BoolString = BoolString.NO;
}

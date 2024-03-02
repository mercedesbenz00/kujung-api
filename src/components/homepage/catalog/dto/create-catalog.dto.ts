import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateCatalogDto {
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Catalog title' })
  title: string;

  @IsNotEmpty({ message: 'summary 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'summary' })
  summary: string;

  @IsNotEmpty({ message: 'category 마당을 입력해 주세요.' })
  @ApiProperty({
    description: 'Catalog category. {catalog, sample, look}',
  })
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Catalog download file url',
  })
  download_file?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Catalog preview file url',
  })
  preview_file?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb url',
  })
  thumb_url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb mobile url',
  })
  thumb_url_mobile?: string;
}

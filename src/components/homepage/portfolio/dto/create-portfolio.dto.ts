import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PortfolioImageDto } from './portfolio-image.dto';

export class CreatePortfolioDto {
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Portfolio title' })
  title: string;

  @IsNotEmpty({ message: 'summary 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'summary' })
  summary: string;

  @IsNotEmpty({ message: 'content 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'content' })
  content: string;

  @IsNotEmpty({ message: 'category 마당을 입력해 주세요.' })
  @ApiProperty({
    description: 'Portfolio category. {brand, convention, artist}',
  })
  category: string;

  @ApiProperty({ description: 'Portfolio collaboration', required: false })
  @IsOptional()
  @IsString()
  collaboration: string;

  @ApiProperty({ description: 'Portfolio online info', required: false })
  @IsOptional()
  @IsString()
  online_info: string;

  @ApiProperty({ description: 'Portfolio place', required: false })
  @IsOptional()
  @IsString()
  place: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'start date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  start_at?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'start date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  end_at?: string;

  @IsArray()
  @IsOptional()
  @Type(() => PortfolioImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    isArray: true,
    example: [{ id: 1, image_url: '' }],
    description: 'Portfolio images',
    type: () => PortfolioImageDto,
  })
  portfolioImages: PortfolioImageDto[];
}

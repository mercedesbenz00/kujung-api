import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManagementLawDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Management law title' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'summary 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Management law summary' })
  summary: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'youtube video url',
  })
  video_url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb url',
  })
  thumb_url?: string;
}

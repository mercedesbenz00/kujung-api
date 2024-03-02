import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Event title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'content' })
  content: string;

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

  @ApiProperty({ description: 'Enabled flag', required: false })
  @IsOptional()
  @IsBoolean()
  enabled: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumbnail url',
  })
  thumb_url?: string;
}

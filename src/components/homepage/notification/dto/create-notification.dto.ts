import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Notification title' })
  title: string;

  @IsNotEmpty({ message: 'content 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'content' })
  content: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Notification top fixed flag',
  })
  top_fixed?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'url',
  })
  url?: string;

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

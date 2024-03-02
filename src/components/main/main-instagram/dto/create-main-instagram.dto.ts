import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMainInstagramDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Main instagram title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: true,
    description: 'instagram url',
  })
  instagram_url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb url',
  })
  thumb_url?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Enable/Disable flag',
  })
  enabled?: boolean;
}

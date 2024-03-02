import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePointLogDto {
  @IsNumber()
  @IsNotEmpty({ message: 'user_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'user id',
  })
  user_id: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    description: 'point',
  })
  point: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'point log memo' })
  memo?: string;
}

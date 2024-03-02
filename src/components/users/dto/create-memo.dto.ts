import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMemoDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'memo content',
  })
  content?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'user_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'user id',
  })
  user_id: number;
}

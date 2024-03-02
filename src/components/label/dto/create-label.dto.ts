import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Label name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'image url',
  })
  image_url?: string;
}

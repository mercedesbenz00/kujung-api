import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessCheckDto {
  @IsNotEmpty({ message: 'business_num 마당을 입력해 주세요.' })
  @IsString()
  @ApiProperty({
    required: true,
    description: 'business number',
  })
  business_num?: string;
}

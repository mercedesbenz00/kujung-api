import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchMemoDto extends PageOptionsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'user_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'user id',
  })
  user_id: number;
}

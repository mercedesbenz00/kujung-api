import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../../shared/dtos';

export class SearchSmartcareServiceMemoDto extends PageOptionsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'smartcare_service_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'smartcare service id',
  })
  smartcare_service_id: number;
}

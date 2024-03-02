import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSmartcareServiceMemoDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'memo content',
  })
  content?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'smartcare_service_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'smartcare service id',
  })
  smartcare_service_id: number;

  @IsNotEmpty({ message: 'status 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    required: true,
    default: null,
    description:
      'status. 1: 점수완료, 2:컨설팅 예정, 3: 시공예정, 4: 시공완료, 5: 상담종료',
  })
  status: number;
}

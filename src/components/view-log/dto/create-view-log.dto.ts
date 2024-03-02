import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateViewLogDto {
  @IsString()
  @IsNotEmpty({ message: 'type 마당을 입력해 주세요.' })
  @ApiProperty({
    description: 'view log type. {portfolio|product|online_house|expert_house}',
  })
  type: string;

  @IsNumber()
  @IsNotEmpty({ message: 'entity id 마당을 입력해 주세요.' })
  @ApiPropertyOptional({
    description: 'view log target entity id',
  })
  entity_id?: number;
}

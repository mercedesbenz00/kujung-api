import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty({ message: 'type 마당을 입력해 주세요.' })
  @ApiProperty({
    description: 'wish type. {smart_store|product|online_house|expert_house}',
  })
  type: string;

  @IsNumber()
  @IsNotEmpty({ message: 'entity id 마당을 입력해 주세요.' })
  @ApiPropertyOptional({
    description: 'wish target entity id',
  })
  entity_id?: number;
}

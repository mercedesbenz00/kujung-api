import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLikeDto {
  @IsString()
  @IsNotEmpty({ message: 'type 마당을 입력해 주세요.' })
  @ApiProperty({
    description:
      'like type. {notification|expert_house|online_house|portfolio|smart_store|user...}',
  })
  type: string;

  @IsNumber()
  @IsNotEmpty({ message: 'entity id 마당을 입력해 주세요.' })
  @ApiPropertyOptional({
    description: 'like target entity id',
  })
  entity_id?: number;
}

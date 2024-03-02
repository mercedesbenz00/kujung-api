import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RecipientDto } from './recipient.dto';

export class CreateSmsDeliveryDto {
  @IsArray()
  @Type(() => RecipientDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    description: 'recipient list',
    type: () => RecipientDto,
  })
  recipients: RecipientDto[];

  @IsString()
  @IsNotEmpty({ message: 'content 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'message delivery content' })
  content: string;
}

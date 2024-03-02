import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifySmsDto {
  @IsNotEmpty({ message: 'Phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @IsNotEmpty({ message: 'sms_code 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'sms code' })
  sms_code: string;
}

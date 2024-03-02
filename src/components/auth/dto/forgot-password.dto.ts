import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User name/Company name' })
  name: string;

  @IsNotEmpty({ message: 'user_id 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'user id' })
  user_id: string;

  @IsNotEmpty({ message: 'Phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @IsNotEmpty({ message: '인증코드를 입력해 주세요.' })
  @ApiProperty({ description: 'Sms code' })
  sms_code: string;
}

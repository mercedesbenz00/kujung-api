import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @IsNotEmpty({ message: 'user_id 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'user id' })
  user_id: string;

  @IsNotEmpty({ message: 'Password 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'password' })
  password: string;
}

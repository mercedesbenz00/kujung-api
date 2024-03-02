import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NaverAuthDto {
  @IsNotEmpty({ message: '토큰을 입력해 주세요.' })
  @ApiProperty({ description: 'naver access token' })
  token: string;
}

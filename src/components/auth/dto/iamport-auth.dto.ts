import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IamportAuthDto {
  @IsNotEmpty({ message: 'impUid 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'imp uid' })
  impUid: string;
}

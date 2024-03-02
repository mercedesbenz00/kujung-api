import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ChangePasswordDto {
  @IsNotEmpty({ message: '현재의 비번을 입력해 주세요.' })
  @ApiProperty({ description: 'User password' })
  cur_password: string;

  @IsNotEmpty({ message: '새 비번을 입력해 주세요.' })
  @ApiProperty({ description: 'User password' })
  new_password: string;
}

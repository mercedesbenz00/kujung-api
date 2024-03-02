import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecipientDto {
  @IsNotEmpty({ message: 'Name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User name/Company name' })
  name: string;

  @IsNotEmpty({ message: 'Phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @IsNotEmpty({ message: 'Nickname 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'nick name' })
  nickname: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'sms receive allow flag',
  })
  allow_sms_recv?: boolean;
}

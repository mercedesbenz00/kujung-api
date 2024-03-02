import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DuplicateCheckDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'user id',
  })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'email',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'user_id',
  })
  user_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'nickname',
  })
  nickname?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'business reg number',
  })
  business_reg_num?: string;
}

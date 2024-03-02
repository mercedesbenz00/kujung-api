import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BannerSettingDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'slide transition interval seconds',
  })
  interval?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'slide auto transition flag',
  })
  auto_transition?: boolean;
}

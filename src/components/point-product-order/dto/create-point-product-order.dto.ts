import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePointProductOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'requester_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'requester id',
  })
  requester_id: number;

  @IsNumber()
  @IsNotEmpty({ message: 'product_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'point product id',
  })
  product_id: number;

  @IsString()
  @IsNotEmpty({ message: 'recipient_name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'recipient name' })
  recipient_name: string;

  @IsString()
  @IsNotEmpty({ message: 'recipient_phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'recipient phone' })
  recipient_phone: string;

  @IsString()
  @IsNotEmpty({ message: 'delivery_addr 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'delivery address' })
  delivery_addr: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'delivery sub address',
  })
  delivery_addr_sub?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'delivery 2nd sub address',
  })
  delivery_zonecode?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'delivery memo',
  })
  delivery_memo?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'delivery status. {waiting, delivered, cancelled}',
  })
  status?: string;
}

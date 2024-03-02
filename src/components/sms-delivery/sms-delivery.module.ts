import { Module } from '@nestjs/common';
import { SmsDeliveryService } from './sms-delivery.service';
import { SmsDeliveryController } from './sms-delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsDelivery } from './entities/sms-delivery.entity';
import { MmsDelivery } from './entities/mms-delivery.entity';
import { SmsCode } from './entities/sms-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmsDelivery, MmsDelivery, SmsCode])],
  exports: [TypeOrmModule, SmsDeliveryService],
  controllers: [SmsDeliveryController],
  providers: [SmsDeliveryService],
})
export class SmsDeliveryModule {}

import { Module } from '@nestjs/common';
import { SmartcareServiceService } from './smartcare-service.service';
import { SmartcareServiceController } from './smartcare-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartcareService } from './entities/smartcare-service.entity';
import { MemoService } from './memo.service';
import { SmartcareServiceImage } from './entities/smartcare-service-image.entity';
import { SmartcareServiceMemo } from './entities/smartcare-service-memo.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { CommonConstantModule } from '../../common-constant/common-constant.module';

@Module({
  imports: [
    CommonConstantModule,
    TypeOrmModule.forFeature([
      Admin,
      SmartcareService,
      SmartcareServiceImage,
      SmartcareServiceMemo,
    ]),
  ],
  exports: [TypeOrmModule, SmartcareServiceService],
  controllers: [SmartcareServiceController],
  providers: [SmartcareServiceService, MemoService],
})
export class SmartcareServiceModule {}

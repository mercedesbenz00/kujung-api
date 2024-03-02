import { Module } from '@nestjs/common';
import { AgencyStoreService } from './agency-store.service';
import { AgencyStoreController } from './agency-store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyStore } from './entities/agency-store.entity';
import { AgencyStoreImage } from './entities/agency-store-image.entity';
import { CommonConstantModule } from './../../common-constant/common-constant.module';

@Module({
  imports: [
    CommonConstantModule,
    TypeOrmModule.forFeature([AgencyStore, AgencyStoreImage]),
  ],
  exports: [TypeOrmModule],
  controllers: [AgencyStoreController],
  providers: [AgencyStoreService],
})
export class AgencyStoreModule {}

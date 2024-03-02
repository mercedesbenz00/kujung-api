import { Module } from '@nestjs/common';
import { ManagementLawService } from './management-law.service';
import { ManagementLawController } from './management-law.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagementLaw } from './entities/management-law.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManagementLaw])],
  exports: [TypeOrmModule, ManagementLawService],
  controllers: [ManagementLawController],
  providers: [ManagementLawService],
})
export class ManagementLawModule {}

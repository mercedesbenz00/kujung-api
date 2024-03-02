import { Module } from '@nestjs/common';
import { SmartConstructionCaseService } from './smart-construction-case.service';
import { SmartConstructionCaseController } from './smart-construction-case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartConstructionCase } from './entities/smart-construction-case.entity';
import { SmartConstructionCaseTag } from './entities/smart-construction-case-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartConstructionCase, SmartConstructionCaseTag]),
  ],
  exports: [TypeOrmModule, SmartConstructionCaseService],
  controllers: [SmartConstructionCaseController],
  providers: [SmartConstructionCaseService],
})
export class SmartConstructionCaseModule {}

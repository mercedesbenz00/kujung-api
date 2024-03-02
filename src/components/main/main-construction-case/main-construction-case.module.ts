import { Module } from '@nestjs/common';
import { MainConstructionCaseService } from './main-construction-case.service';
import { MainConstructionCaseController } from './main-construction-case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainConstructionCase } from './entities/main-construction-case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MainConstructionCase])],
  exports: [TypeOrmModule],
  controllers: [MainConstructionCaseController],
  providers: [MainConstructionCaseService],
})
export class MainConstructionCaseModule {}

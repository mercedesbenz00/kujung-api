import { Module } from '@nestjs/common';
import { CommonConstantService } from './common-constant.service';
import { CommonConstantController } from './common-constant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonConstant } from './entities/common-constant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommonConstant])],
  exports: [TypeOrmModule, CommonConstantService],
  controllers: [CommonConstantController],
  providers: [CommonConstantService],
})
export class CommonConstantModule {}

import { Module } from '@nestjs/common';
import { MainInstagramService } from './main-instagram.service';
import { MainInstagramController } from './main-instagram.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainInstagram } from './entities/main-instagram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MainInstagram])],
  exports: [TypeOrmModule, MainInstagramService],
  controllers: [MainInstagramController],
  providers: [MainInstagramService],
})
export class MainInstagramModule {}

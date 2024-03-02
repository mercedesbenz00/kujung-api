import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from './entities/catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Catalog])],
  exports: [TypeOrmModule, CatalogService],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}

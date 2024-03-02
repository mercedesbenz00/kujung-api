import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

import { CategoryImage } from './entities/category-image.entity';
import { CategoryYoutube } from './entities/category-youtube.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryImage, CategoryYoutube]),
  ],
  exports: [TypeOrmModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

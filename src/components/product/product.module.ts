import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ViewLogModule } from '../view-log/view-log.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductTag } from './entities/product-tag.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductBlog } from './entities/product-blog.entity';
import { ProductYoutube } from './entities/product-youtube.entity';
import { ProductPopularity } from './entities/product-popularity.entity';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Wish } from '../wish/entities/wish.entity';

@Module({
  imports: [
    UsersModule,
    ViewLogModule,
    TypeOrmModule.forFeature([
      Product,
      Category,
      Tag,
      ProductTag,
      ProductImage,
      ProductBlog,
      ProductYoutube,
      ProductPopularity,
      Wish,
    ]),
  ],
  exports: [TypeOrmModule, ProductService],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

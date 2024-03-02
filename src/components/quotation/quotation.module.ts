import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { DetailedQuotationService } from './detailed-quotation.service';
import { MemoService } from './memo.service';
import { DetailedQuotationController } from './detailed-quotation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailedQuotation } from './entities/detailed-quotation.entity';
import { DetailedQuotationImage } from './entities/detailed-quotation-image.entity';
import { DetailedQuotationMemo } from './entities/detailed-quotation-memo.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      DetailedQuotation,
      Admin,
      Tag,
      DetailedQuotationImage,
      DetailedQuotationMemo,
      Product,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [DetailedQuotationController],
  providers: [DetailedQuotationService, MemoService],
})
export class QuotationModule {}

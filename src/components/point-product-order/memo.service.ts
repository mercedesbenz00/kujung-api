import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePointProductOrderMemoDto } from './dto/create-point-product-order-memo.dto';
import { UpdatePointProductOrderMemoDto } from './dto/update-point-product-order-memo.dto';
import { SearchPointProductOrderMemoDto } from './dto/search-point-product-order-memo.dto';
import { PointProductOrderMemo } from './entities/point-product-order-memo.entity';
import { Admin } from '../admin/entities/admin.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(PointProductOrderMemo)
    private memoRepository: Repository<PointProductOrderMemo>,
  ) {}
  async create(
    createMemoDto: CreatePointProductOrderMemoDto,
    userId: number = undefined,
  ) {
    try {
      const newMemo = new PointProductOrderMemo();
      newMemo.content = createMemoDto.content;
      newMemo.point_product_order_id = createMemoDto.point_product_order_id;
      if (userId !== undefined) {
        const user = new Admin();
        user.id = userId;
        newMemo.creator = user;
      }

      return await this.memoRepository.save(newMemo);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchPointProductOrderMemoDto,
  ): Promise<PageDto<PointProductOrderMemo>> {
    const orderBy = pageOptionsDto.sortBy || 'id';
    const query = this.memoRepository
      .createQueryBuilder('point_product_order_memo')
      .where('point_product_order_id = :point_product_order_id', {
        point_product_order_id: pageOptionsDto.point_product_order_id,
      })
      .leftJoinAndSelect('point_product_order_memo.creator', 'creator')
      .leftJoinAndSelect('point_product_order_memo.modifier', 'modifier')
      .select([
        'point_product_order_memo.id',
        'point_product_order_memo.content',
        'point_product_order_memo.created_at',
        'point_product_order_memo.updated_at',
        'creator.name',
        'modifier.name',
      ])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .orderBy(`point_product_order_memo.${orderBy}`, Order.DESC);
    const [entities, totalCount] = await query.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<PointProductOrderMemo> {
    const memo = await this.memoRepository.findOne({
      where: { id: id },
    });
    return memo;
  }

  async update(
    id: number,
    updateMemoDto: UpdatePointProductOrderMemoDto,
    userId: number = undefined,
  ) {
    try {
      const memo = await this.findOne(id);

      if (memo) {
        if (updateMemoDto.content !== undefined) {
          memo.content = updateMemoDto.content;
        }

        if (userId !== undefined) {
          const user = new Admin();
          user.id = userId;
          memo.modifier = user;
        }
        return await this.memoRepository.save(memo);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.memoRepository.delete(id);
  }
}

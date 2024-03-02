import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetailedQuotationMemoDto } from './dto/create-detailed-quotation-memo.dto';
import { UpdateDetailedQuotationMemoDto } from './dto/update-detailed-quotation-memo.dto';
import { SearchDetailedQuotationMemoDto } from './dto/search-detailed-quotation-memo.dto';
import { DetailedQuotationMemo } from './entities/detailed-quotation-memo.entity';
import { Admin } from '../admin/entities/admin.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(DetailedQuotationMemo)
    private memoRepository: Repository<DetailedQuotationMemo>,
  ) {}
  async create(
    createMemoDto: CreateDetailedQuotationMemoDto,
    userId: number = undefined,
  ) {
    try {
      const newMemo = new DetailedQuotationMemo();
      newMemo.content = createMemoDto.content;
      newMemo.detailed_quotation_id = createMemoDto.detailed_quotation_id;
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
    pageOptionsDto: SearchDetailedQuotationMemoDto,
  ): Promise<PageDto<DetailedQuotationMemo>> {
    const orderBy = pageOptionsDto.sortBy || 'id';
    const query = this.memoRepository
      .createQueryBuilder('detailed_quotation_memo')
      .where('detailed_quotation_id = :detailed_quotation_id', {
        detailed_quotation_id: pageOptionsDto.detailed_quotation_id,
      })
      .leftJoinAndSelect('detailed_quotation_memo.creator', 'creator')
      .leftJoinAndSelect('detailed_quotation_memo.modifier', 'modifier')
      .select([
        'detailed_quotation_memo.id',
        'detailed_quotation_memo.content',
        'detailed_quotation_memo.created_at',
        'detailed_quotation_memo.updated_at',
        'creator.name',
        'modifier.name',
      ])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .orderBy(`detailed_quotation_memo.${orderBy}`, Order.DESC);
    const [entities, totalCount] = await query.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<DetailedQuotationMemo> {
    const memo = await this.memoRepository.findOne({
      where: { id: id },
    });
    return memo;
  }

  async update(
    id: number,
    updateMemoDto: UpdateDetailedQuotationMemoDto,
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSmartcareServiceMemoDto } from './dto/create-smartcare-service-memo.dto';
import { UpdateSmartcareServiceMemoDto } from './dto/update-smartcare-service-memo.dto';
import { SearchSmartcareServiceMemoDto } from './dto/search-smartcare-service-memo.dto';
import { SmartcareServiceMemo } from './entities/smartcare-service-memo.entity';
import { SmartcareService } from './entities/smartcare-service.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { Order } from '../../../shared/constants';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(SmartcareServiceMemo)
    private memoRepository: Repository<SmartcareServiceMemo>,
  ) {}
  async create(
    createMemoDto: CreateSmartcareServiceMemoDto,
    userId: number = undefined,
  ) {
    try {
      const newMemo = new SmartcareServiceMemo();
      newMemo.content = createMemoDto.content;
      newMemo.status = createMemoDto.status;
      if (createMemoDto.smartcare_service_id) {
        newMemo.smartcareService = new SmartcareService();
        newMemo.smartcareService.id = createMemoDto.smartcare_service_id;
      }
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
    pageOptionsDto: SearchSmartcareServiceMemoDto,
  ): Promise<PageDto<SmartcareServiceMemo>> {
    const orderBy = pageOptionsDto.sortBy || 'id';
    const query = this.memoRepository
      .createQueryBuilder('smartcare_service_memo')
      .where('smartcare_service_id = :smartcare_service_id', {
        smartcare_service_id: pageOptionsDto.smartcare_service_id,
      })
      .leftJoinAndSelect('smartcare_service_memo.creator', 'creator')
      .leftJoinAndSelect('smartcare_service_memo.modifier', 'modifier')
      .select([
        'smartcare_service_memo.id',
        'smartcare_service_memo.content',
        'smartcare_service_memo.status',
        'smartcare_service_memo.created_at',
        'smartcare_service_memo.updated_at',
        'creator.name',
        'modifier.name',
      ])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .orderBy(`smartcare_service_memo.${orderBy}`, Order.DESC);
    const [entities, totalCount] = await query.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<SmartcareServiceMemo> {
    const memo = await this.memoRepository.findOne({
      where: { id: id },
    });
    return memo;
  }

  async update(
    id: number,
    updateMemoDto: UpdateSmartcareServiceMemoDto,
    userId: number = undefined,
  ) {
    try {
      const memo = await this.findOne(id);

      if (memo) {
        if (updateMemoDto.content !== undefined) {
          memo.content = updateMemoDto.content;
        }
        if (updateMemoDto.status !== undefined) {
          memo.status = updateMemoDto.status;
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { SearchMemoDto } from './dto/search-memo.dto';
import { UserMemo } from './entities/user-memo.entity';
import { Admin } from '../admin/entities/admin.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(UserMemo)
    private memoRepository: Repository<UserMemo>,
  ) {}
  async create(createMemoDto: CreateMemoDto, userId: number = undefined) {
    try {
      const newMemo = new UserMemo();
      newMemo.content = createMemoDto.content;
      newMemo.user_id = createMemoDto.user_id;
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

  async getItemList(pageOptionsDto: SearchMemoDto): Promise<PageDto<UserMemo>> {
    const orderBy = pageOptionsDto.sortBy || 'id';
    const query = this.memoRepository
      .createQueryBuilder('user_memo')
      .where('user_memo.user_id = :user_id', {
        user_id: pageOptionsDto.user_id,
      })
      .leftJoinAndSelect('user_memo.creator', 'creator')
      .leftJoinAndSelect('user_memo.modifier', 'modifier')
      .select([
        'user_memo.id',
        'user_memo.content',
        'user_memo.created_at',
        'user_memo.updated_at',
        'creator.name',
        'modifier.name',
      ])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .orderBy(`user_memo.${orderBy}`, Order.DESC);
    const [entities, totalCount] = await query.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<UserMemo> {
    const memo = await this.memoRepository.findOne({
      where: { id: id },
    });
    return memo;
  }

  async update(
    id: number,
    updateMemoDto: UpdateMemoDto,
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

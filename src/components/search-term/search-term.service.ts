import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, ILike } from 'typeorm';
import { CreateSearchTermDto } from './dto/create-search-term.dto';
import { UpdateSearchTermDto } from './dto/update-search-term.dto';
import { SearchTerm } from './entities/search-term.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';
import { SearchSearchTermDto } from './dto/search-search-term.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';

@Injectable()
export class SearchTermService {
  constructor(
    @InjectRepository(SearchTerm)
    private searchTermRepository: Repository<SearchTerm>,
  ) {}
  async create(createSearchTermDto: CreateSearchTermDto) {
    return await this.searchTermRepository.save(createSearchTermDto);
  }

  async getItemList(
    pageOptionsDto: SearchSearchTermDto,
  ): Promise<PageDto<SearchTerm>> {
    const whereCondition: any = {};

    const sqlQueryInfo: FindManyOptions = {
      order: {
        [pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'created_at']:
          pageOptionsDto.order,
        updated_at: Order.DESC,
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    };

    if (pageOptionsDto.display !== undefined) {
      whereCondition.display = pageOptionsDto.display;
    }
    if (pageOptionsDto.type !== undefined) {
      whereCondition.type = pageOptionsDto.type;
    }
    if (pageOptionsDto.main_display !== undefined) {
      whereCondition.main_display = pageOptionsDto.main_display;
    }
    if (pageOptionsDto.q) {
      whereCondition.name = ILike(`%${pageOptionsDto.q}%`);
    }
    if (Object.keys(whereCondition).length) {
      sqlQueryInfo.where = whereCondition;
    }
    const [entities, totalCount] = await this.searchTermRepository.findAndCount(
      sqlQueryInfo,
    );
    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
    // return this.searchTermRepository.find();
  }

  findOne(id: number): Promise<SearchTerm> {
    return this.searchTermRepository.findOneBy({ id: id });
  }

  async update(id: number, updateSearchTermDto: UpdateSearchTermDto) {
    const searchTerm = await this.findOne(id);
    if (searchTerm)
      return await this.searchTermRepository.update(id, updateSearchTermDto);
    return;
  }

  async remove(id: number) {
    return await this.searchTermRepository.delete(id);
  }
  async updateCount(entityIdArrayDto: EntityIdArrayDto) {
    try {
      for (const id of entityIdArrayDto.ids) {
        await this.searchTermRepository
          .createQueryBuilder('search_terms')
          .update(SearchTerm)
          .set({ count: () => `count + ${1}` })
          .where('id = :entityId', { entityId: id })
          .execute();
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

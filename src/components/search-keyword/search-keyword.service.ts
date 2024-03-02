import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSearchKeywordDto } from './dto/create-search-keyword.dto';
import { UpdateSearchKeywordDto } from './dto/update-search-keyword.dto';
import { SearchSearchKeywordDto } from './dto/search-search-keyword.dto';
import { SearchKeyword } from './entities/search-keyword.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { SearchKeywordTypo } from './entities/search-keyword-typo.entity';

@Injectable()
export class SearchKeywordService {
  constructor(
    @InjectRepository(SearchKeyword)
    private searchKeywordRepository: Repository<SearchKeyword>,
  ) {}
  async create(createSearchKeywordDto: CreateSearchKeywordDto) {
    try {
      const newSearchKeyword = new SearchKeyword();
      newSearchKeyword.name = createSearchKeywordDto.name;

      if (createSearchKeywordDto.searchKeywordTypos) {
        newSearchKeyword.searchKeywordTypos = [];
        for (const searchKeywordTypos of createSearchKeywordDto.searchKeywordTypos) {
          const searchKeywordTyposEntity = new SearchKeywordTypo();
          searchKeywordTyposEntity.typos = searchKeywordTypos.typos?.trim();
          newSearchKeyword.searchKeywordTypos.push(searchKeywordTyposEntity);
        }
      }

      return await this.searchKeywordRepository.save(newSearchKeyword);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAutocompleteItemList(pageOptionsDto: SearchSearchKeywordDto) {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.searchKeywordRepository
        .createQueryBuilder('search_keywords')
        .leftJoinAndSelect(
          'search_keywords.searchKeywordTypos',
          'searchKeywordTypos',
        )
        .select(['search_keywords.id', 'search_keywords.name']);

      if (pageOptionsDto.q !== undefined) {
        // correct keyword test codes
        // const keyword = await this.getCorrectKeyword(pageOptionsDto.q);
        // console.log('keyword', keyword);
        query = query.andWhere(
          `(LOWER(search_keywords.name) LIKE LOWER(:pattern) OR LOWER(searchKeywordTypos.typos) LIKE LOWER(:pattern)
           OR fn_initial_sound(searchKeywordTypos.typos) LIKE :pattern OR fn_initial_sound(search_keywords.name) LIKE :pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`search_keywords.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.searchKeywordRepository.count({
          where: whereGlobalCondition,
        });
      }
      const pageMetaDto = new PageMetaDto({
        totalCount,
        pageOptionsDto,
        allCount,
      });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getItemList(
    pageOptionsDto: SearchSearchKeywordDto,
  ): Promise<PageDto<SearchKeyword>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.searchKeywordRepository
        .createQueryBuilder('search_keywords')
        .leftJoinAndSelect(
          'search_keywords.searchKeywordTypos',
          'searchKeywordTyposSearch',
        )
        .leftJoinAndSelect(
          'search_keywords.searchKeywordTypos',
          'searchKeywordTypos',
        )
        .select([
          'search_keywords.id',
          'searchKeywordTypos',
          'search_keywords.name',
          'search_keywords.updated_at',
        ]);

      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `(LOWER(search_keywords.name) LIKE LOWER(:pattern) OR LOWER(searchKeywordTyposSearch.typos) LIKE LOWER(:pattern)
           OR fn_initial_sound(searchKeywordTyposSearch.typos) LIKE :pattern OR fn_initial_sound(search_keywords.name) LIKE :pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`search_keywords.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.searchKeywordRepository.count({
          where: whereGlobalCondition,
        });
      }
      const pageMetaDto = new PageMetaDto({
        totalCount,
        pageOptionsDto,
        allCount,
      });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCorrectKeyword(keyword: string) {
    let correctKeyword = keyword?.trim();
    if (correctKeyword) {
      let query = this.searchKeywordRepository
        .createQueryBuilder('search_keywords')
        .leftJoinAndSelect(
          'search_keywords.searchKeywordTypos',
          'searchKeywordTypos',
        )
        .select(['search_keywords.id', 'search_keywords.name']);

      query = query.andWhere(
        `(LOWER(search_keywords.name) LIKE LOWER(:pattern) OR LOWER(searchKeywordTypos.typos) LIKE LOWER(:pattern)
         OR fn_initial_sound(searchKeywordTypos.typos) LIKE :pattern OR fn_initial_sound(search_keywords.name) LIKE :pattern)`,
        {
          pattern: `${correctKeyword}`,
        },
      );
      const searchKeywordInfo = await query.getOne();
      if (searchKeywordInfo) {
        correctKeyword = searchKeywordInfo.name;
      }
    }

    return correctKeyword || null;
  }

  async findOne(id: number): Promise<any> {
    const searchKeyword = await this.searchKeywordRepository.findOne({
      where: { id: id },
      relations: {
        searchKeywordTypos: true,
      },
    });
    return searchKeyword;
  }

  async update(id: number, updateSearchKeywordDto: UpdateSearchKeywordDto) {
    try {
      const searchKeyword = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateSearchKeywordDto[field] !== undefined)
          searchKeyword[field] = updateSearchKeywordDto[field];
      };

      if (searchKeyword) {
        updateValue('name');
        if (updateSearchKeywordDto.searchKeywordTypos) {
          searchKeyword.searchKeywordTypos = [];
          for (const searchKeywordTypos of updateSearchKeywordDto.searchKeywordTypos) {
            const searchKeywordTyposEntity = new SearchKeywordTypo();
            if (searchKeywordTypos.id) {
              searchKeywordTyposEntity.id = searchKeywordTypos.id;
            }
            searchKeywordTyposEntity.typos = searchKeywordTypos.typos?.trim();
            searchKeyword.searchKeywordTypos.push(searchKeywordTyposEntity);
          }
        }
        return await this.searchKeywordRepository.save(searchKeyword);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.searchKeywordRepository.delete(id);
  }
}

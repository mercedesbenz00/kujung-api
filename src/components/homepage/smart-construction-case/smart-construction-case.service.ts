import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSmartConstructionCaseDto } from './dto/create-smart-construction-case.dto';
import { UpdateSmartConstructionCaseDto } from './dto/update-smart-construction-case.dto';
import { SearchSmartConstructionCaseDto } from './dto/search-smart-construction-case.dto';
import { SmartConstructionCase } from './entities/smart-construction-case.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { Tag } from '../../tag/entities/tag.entity';
import { Product } from '../../product/entities/product.entity';

@Injectable()
export class SmartConstructionCaseService {
  constructor(
    @InjectRepository(SmartConstructionCase)
    private smartConstructionCaseRepository: Repository<SmartConstructionCase>,
  ) {}
  async create(createSmartConstructionCaseDto: CreateSmartConstructionCaseDto) {
    try {
      const newSmartConstructionCase = new SmartConstructionCase();
      if (createSmartConstructionCaseDto.area_space_code !== undefined) {
        newSmartConstructionCase.area_space_info = new CommonConstant();
        newSmartConstructionCase.area_space_info.id =
          createSmartConstructionCaseDto.area_space_code;
      }
      if (createSmartConstructionCaseDto.family_type_code !== undefined) {
        newSmartConstructionCase.family_type_info = new CommonConstant();
        newSmartConstructionCase.family_type_info.id =
          createSmartConstructionCaseDto.family_type_code;
      }
      newSmartConstructionCase.title = createSmartConstructionCaseDto.title;
      newSmartConstructionCase.summary = createSmartConstructionCaseDto.summary;
      newSmartConstructionCase.url = createSmartConstructionCaseDto.url;
      newSmartConstructionCase.thumb_url =
        createSmartConstructionCaseDto.thumb_url;

      if (createSmartConstructionCaseDto.tags) {
        newSmartConstructionCase.tags = [];
        for (const tag of createSmartConstructionCaseDto.tags) {
          const tagEntity = new Tag();
          tagEntity.id = tag.id;
          newSmartConstructionCase.tags.push(tagEntity);
        }
      }
      if (createSmartConstructionCaseDto.product_id !== undefined) {
        newSmartConstructionCase.product = new Product();
        newSmartConstructionCase.product.id =
          createSmartConstructionCaseDto.product_id;
      }

      return await this.smartConstructionCaseRepository.save(
        newSmartConstructionCase,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchSmartConstructionCaseDto,
  ): Promise<PageDto<SmartConstructionCase>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.smartConstructionCaseRepository
        .createQueryBuilder('smart_construction_cases')
        .leftJoinAndSelect(
          'smart_construction_cases.area_space_info',
          'area_space_info',
        )
        .leftJoinAndSelect(
          'smart_construction_cases.family_type_info',
          'family_type_info',
        )
        .leftJoinAndSelect('smart_construction_cases.product', 'product')
        .leftJoinAndSelect('product.category_level1', 'category_level1')
        .leftJoinAndSelect('product.category_level2', 'category_level2')
        .leftJoinAndSelect('product.category_level3', 'category_level3')
        .leftJoinAndSelect(
          'product.house_style_info',
          'product_house_style_info',
        )
        .leftJoinAndSelect('product.color_info', 'product_color_info')
        .leftJoinAndSelect('smart_construction_cases.tags', 'tags')
        .select([
          'smart_construction_cases.id',
          'area_space_info',
          'family_type_info',
          'tags',
          'smart_construction_cases.title',
          'smart_construction_cases.summary',
          'smart_construction_cases.url',
          'smart_construction_cases.thumb_url',
          'smart_construction_cases.created_at',
          'smart_construction_cases.updated_at',
          'product.thumbnail_url',
          'product_house_style_info',
          'product_color_info',
          'category_level1.name',
          'category_level2.name',
          'category_level3.name',
        ]);

      if (pageOptionsDto.tags && pageOptionsDto.tags.length) {
        query = query.andWhere(`tags.id IN (:...tags)`, {
          tags: pageOptionsDto.tags,
        });
      }

      if (
        pageOptionsDto.area_space_list &&
        pageOptionsDto.area_space_list.length
      ) {
        query = query.andWhere(`area_space_info.id IN (:...area_space_list)`, {
          area_space_list: pageOptionsDto.area_space_list,
        });
      }

      if (
        pageOptionsDto.family_type_list &&
        pageOptionsDto.family_type_list.length
      ) {
        query = query.andWhere(
          `family_type_info.id IN (:...family_type_list)`,
          {
            family_type_list: pageOptionsDto.family_type_list,
          },
        );
      }
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(smart_construction_cases.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      const queryDateType = pageOptionsDto.date_type || 'updated_at';
      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `smart_construction_cases.${queryDateType} BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(
          `smart_construction_cases.${queryDateType} >= :from`,
          {
            from: new Date(pageOptionsDto.from),
          },
        );
      } else if (pageOptionsDto.to) {
        query = query.andWhere(
          `smart_construction_cases.${queryDateType} <= :to`,
          {
            to: new Date(pageOptionsDto.to),
          },
        );
      }

      query = pageOptionsDto.take
        ? query
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy(
              `smart_construction_cases.${orderBy}`,
              pageOptionsDto.order,
            )
        : query.orderBy(
            `smart_construction_cases.${orderBy}`,
            pageOptionsDto.order,
          );

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.smartConstructionCaseRepository.count({
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

  async findOne(id: number): Promise<any> {
    const smartConstructionCase =
      await this.smartConstructionCaseRepository.findOne({
        where: { id: id },
        relations: {
          tags: true,
          product: {
            category_level1: true,
            category_level2: true,
            category_level3: true,
            color_info: true,
            house_style_info: true,
            area_space_info: true,
            family_type_info: true,
          },
          area_space_info: true,
          family_type_info: true,
        },
      });
    return smartConstructionCase;
  }

  async update(
    id: number,
    updateSmartConstructionCaseDto: UpdateSmartConstructionCaseDto,
  ) {
    try {
      const smartConstructionCase = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateSmartConstructionCaseDto[field] !== undefined)
          smartConstructionCase[field] = updateSmartConstructionCaseDto[field];
      };

      if (smartConstructionCase) {
        updateValue('title');
        updateValue('summary');
        updateValue('url');
        updateValue('thumb_url');
        if (updateSmartConstructionCaseDto.area_space_code !== undefined) {
          smartConstructionCase.area_space_info = new CommonConstant();
          smartConstructionCase.area_space_info.id =
            updateSmartConstructionCaseDto.area_space_code;
        }
        if (updateSmartConstructionCaseDto.family_type_code !== undefined) {
          smartConstructionCase.family_type_info = new CommonConstant();
          smartConstructionCase.family_type_info.id =
            updateSmartConstructionCaseDto.family_type_code;
        }

        if (updateSmartConstructionCaseDto.tags) {
          smartConstructionCase.tags = [];

          for (const tag of updateSmartConstructionCaseDto.tags) {
            const tagEntity = new Tag();
            tagEntity.id = tag.id;
            smartConstructionCase.tags.push(tagEntity);
          }
        }
        if (updateSmartConstructionCaseDto.product_id !== undefined) {
          smartConstructionCase.product = new Product();
          smartConstructionCase.product.id =
            updateSmartConstructionCaseDto.product_id;
        }
        return await this.smartConstructionCaseRepository.save(
          smartConstructionCase,
        );
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.smartConstructionCaseRepository.delete(id);
  }
}

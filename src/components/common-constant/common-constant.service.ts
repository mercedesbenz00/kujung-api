import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, ILike, In } from 'typeorm';
import { CreateCommonConstantDto } from './dto/create-common-constant.dto';
import { UpdateCommonConstantDto } from './dto/update-common-constant.dto';
import { CommonConstant } from './entities/common-constant.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';
import { SearchCommonConstantDto } from './dto/search-common-constant.dto';

@Injectable()
export class CommonConstantService {
  constructor(
    @InjectRepository(CommonConstant)
    private commonConstantRepository: Repository<CommonConstant>,
  ) {}
  async create(createCommonConstantDto: CreateCommonConstantDto) {
    return await this.commonConstantRepository.save(createCommonConstantDto);
  }

  async getItemList(pageOptionsDto: SearchCommonConstantDto): Promise<any> {
    const orderBy = pageOptionsDto.sortBy || 'id';
    let query = this.commonConstantRepository
      .createQueryBuilder('common_constants')
      .select('common_constants.type', 'type')
      .addSelect(
        'JSON_ARRAYAGG(JSON_OBJECT("id", common_constants.id, "name", common_constants.name, "display", common_constants.display, "main_display", common_constants.main_display, "priority", common_constants.priority))',
        'items',
      );

    if (pageOptionsDto.typeList && pageOptionsDto.typeList.length) {
      query = query.andWhere(`common_constants.type IN (:...typeList)`, {
        typeList: pageOptionsDto.typeList,
      });
    }

    if (pageOptionsDto.main_display !== undefined) {
      query = query.andWhere(`common_constants.main_display = :main_display`, {
        main_display: pageOptionsDto.main_display,
      });
    }
    if (pageOptionsDto.display !== undefined) {
      query = query.andWhere(`common_constants.display = :display`, {
        display: pageOptionsDto.display,
      });
    }
    if (pageOptionsDto.q && pageOptionsDto.q.length) {
      query = query.andWhere(
        `LOWER(common_constants.name) LIKE LOWER(:pattern)`,
        {
          pattern: `%${pageOptionsDto.q}%`,
        },
      );
    }
    query = query.groupBy('common_constants.type');
    query = query.orderBy(
      `common_constants.${orderBy}`,
      pageOptionsDto.order || Order.DESC,
    );

    const queryResult = await query.getRawMany();

    const result = queryResult.map((result) => ({
      type: result.type,
      items: JSON.parse(result.items),
    }));

    const sortedResult = [];

    if (result && pageOptionsDto.typeList && pageOptionsDto.typeList.length) {
      for (const typeName of pageOptionsDto.typeList) {
        const typeData = result.find((item) => item.type === typeName);
        if (!typeData) {
          sortedResult.push({
            type: typeName,
            items: [],
          });
        } else {
          sortedResult.push(typeData);
        }
      }
    } else {
      return result;
    }

    return sortedResult;
  }

  findOne(id: number): Promise<CommonConstant> {
    return this.commonConstantRepository.findOneBy({ id: id });
  }

  findCode(type: string, name: string): Promise<CommonConstant> {
    return this.commonConstantRepository.findOneBy({ type: type, name: name });
  }

  async update(id: number, updateCommonConstantDto: UpdateCommonConstantDto) {
    const commonConstant = await this.findOne(id);
    if (commonConstant)
      return await this.commonConstantRepository.update(
        id,
        updateCommonConstantDto,
      );
    return;
  }

  async remove(id: number) {
    return await this.commonConstantRepository.delete(id);
  }
}

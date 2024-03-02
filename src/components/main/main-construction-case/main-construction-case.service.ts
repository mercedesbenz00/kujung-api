import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMainConstructionCaseDto } from './dto/create-main-construction-case.dto';
import { UpdateMainConstructionCaseDto } from './dto/update-main-construction-case.dto';
import { MainConstructionCase } from './entities/main-construction-case.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchMainConstructionCaseDto } from './dto/search-main-construction-case.dto';
import { EntityIdArrayDto } from '../../tag/dto/create-tag.dto';

@Injectable()
export class MainConstructionCaseService {
  constructor(
    @InjectRepository(MainConstructionCase)
    private mainConstructionCaseRepository: Repository<MainConstructionCase>,
  ) {}
  async create(createMainConstructionCaseDto: CreateMainConstructionCaseDto) {
    return await this.mainConstructionCaseRepository.save({
      ...createMainConstructionCaseDto,
    });
  }

  async getItemList(
    pageOptionsDto: SearchMainConstructionCaseDto,
  ): Promise<PageDto<MainConstructionCase>> {
    const queryBuilder = this.mainConstructionCaseRepository.createQueryBuilder(
      'main_construction_cases',
    );

    if (pageOptionsDto.enabled !== undefined) {
      queryBuilder.where('enabled = :enabled', {
        enabled: pageOptionsDto.enabled,
      });
    }
    queryBuilder
      .orderBy(
        !!pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'created_at',
        pageOptionsDto.order,
      )
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
    // return this.mainConstructionCaseRepository.find();
  }

  findOne(id: number): Promise<MainConstructionCase> {
    return this.mainConstructionCaseRepository.findOneBy({ id: id });
  }

  async update(
    id: number,
    updateMainConstructionCaseDto: UpdateMainConstructionCaseDto,
  ) {
    const mainConstructionCase = await this.findOne(id);
    if (mainConstructionCase) {
      return await this.mainConstructionCaseRepository.update(id, {
        ...updateMainConstructionCaseDto,
      });
    }
    return;
  }

  async remove(id: number) {
    return await this.mainConstructionCaseRepository.delete(id);
  }
  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.mainConstructionCaseRepository.update(id, { seq: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

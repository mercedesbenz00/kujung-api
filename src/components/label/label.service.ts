import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, ILike } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entities/label.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';
import { SearchLabelDto } from './dto/search-label.dto';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}
  async create(createLabelDto: CreateLabelDto) {
    return await this.labelRepository.save(createLabelDto);
  }

  async getItemList(pageOptionsDto: SearchLabelDto): Promise<PageDto<Label>> {
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
    if (pageOptionsDto.q) {
      whereCondition.name = ILike(`%${pageOptionsDto.q}%`);
    }
    if (Object.keys(whereCondition).length) {
      sqlQueryInfo.where = whereCondition;
    }
    const [entities, totalCount] = await this.labelRepository.findAndCount(
      sqlQueryInfo,
    );
    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number): Promise<Label> {
    return this.labelRepository.findOneBy({ id: id });
  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    const label = await this.findOne(id);
    if (label) return await this.labelRepository.update(id, updateLabelDto);
    return;
  }

  async remove(id: number) {
    return await this.labelRepository.delete(id);
  }
}

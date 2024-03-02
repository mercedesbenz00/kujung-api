import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, ILike } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';
import { SearchTagDto } from './dto/search-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}
  async create(createTagDto: CreateTagDto) {
    return await this.tagRepository.save(createTagDto);
  }

  async getItemList(pageOptionsDto: SearchTagDto): Promise<PageDto<Tag>> {
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
    if (pageOptionsDto.main_display !== undefined) {
      whereCondition.main_display = pageOptionsDto.main_display;
    }
    if (pageOptionsDto.q) {
      whereCondition.name = ILike(`%${pageOptionsDto.q}%`);
    }
    if (Object.keys(whereCondition).length) {
      sqlQueryInfo.where = whereCondition;
    }
    const [entities, totalCount] = await this.tagRepository.findAndCount(
      sqlQueryInfo,
    );
    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
    // return this.tagRepository.find();
  }

  findOne(id: number): Promise<Tag> {
    return this.tagRepository.findOneBy({ id: id });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    if (tag) return await this.tagRepository.update(id, updateTagDto);
    return;
  }

  async remove(id: number) {
    return await this.tagRepository.delete(id);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMainInstagramDto } from './dto/create-main-instagram.dto';
import { UpdateMainInstagramDto } from './dto/update-main-instagram.dto';
import { MainInstagram } from './entities/main-instagram.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchMainInstagramDto } from './dto/search-main-instagram.dto';
import { getScrapImageUrl } from './../../../shared/utils';
import { EntityIdArrayDto } from '../../tag/dto/create-tag.dto';

@Injectable()
export class MainInstagramService {
  constructor(
    @InjectRepository(MainInstagram)
    private mainInstagramRepository: Repository<MainInstagram>,
  ) {}
  async create(createMainInstagramDto: CreateMainInstagramDto) {
    let thumb_url = null;
    if (
      createMainInstagramDto.instagram_url &&
      !createMainInstagramDto.thumb_url
    ) {
      thumb_url = await getScrapImageUrl(createMainInstagramDto.instagram_url);
    } else {
      thumb_url = createMainInstagramDto.thumb_url;
    }
    return await this.mainInstagramRepository.save({
      ...createMainInstagramDto,
      thumb_url,
    });
  }

  async getItemList(
    pageOptionsDto: SearchMainInstagramDto,
  ): Promise<PageDto<MainInstagram>> {
    const queryBuilder =
      this.mainInstagramRepository.createQueryBuilder('main_instagrams');

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
    // return this.mainInstagramRepository.find();
  }

  findOne(id: number): Promise<MainInstagram> {
    return this.mainInstagramRepository.findOneBy({ id: id });
  }

  async update(id: number, updateMainInstagramDto: UpdateMainInstagramDto) {
    const mainInstagram = await this.findOne(id);
    if (mainInstagram) {
      // let thumb_url = mainInstagram.thumb_url;
      // if (updateMainInstagramDto.instagram_url) {
      //   thumb_url = await getScrapImageUrl(
      //     updateMainInstagramDto.instagram_url,
      //   );
      // }
      return await this.mainInstagramRepository.update(id, {
        ...updateMainInstagramDto,
      });
    }
    return;
  }

  async remove(id: number) {
    return await this.mainInstagramRepository.delete(id);
  }
  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.mainInstagramRepository.update(id, { seq: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateAllUrls() {
    const queryBuilder =
      this.mainInstagramRepository.createQueryBuilder('main_instagrams');
    const { entities } = await queryBuilder.getRawAndEntities();
    for (const instagram of entities) {
      if (instagram.instagram_url) {
        const thumb_url = await getScrapImageUrl(instagram.instagram_url);
        await this.mainInstagramRepository.update(instagram.id, {
          thumb_url,
        });
      }
    }
  }
}

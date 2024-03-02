import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMainYoutubeDto } from './dto/create-main-youtube.dto';
import { UpdateMainYoutubeDto } from './dto/update-main-youtube.dto';
import { MainYoutube } from './entities/main-youtube.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchMainYoutubeDto } from './dto/search-main-youtube.dto';
import { getYoutubeThumbUrl } from './../../../shared/utils';
import { EntityIdArrayDto } from '../../tag/dto/create-tag.dto';

@Injectable()
export class MainYoutubeService {
  constructor(
    @InjectRepository(MainYoutube)
    private mainYoutubeRepository: Repository<MainYoutube>,
  ) {}
  async create(createMainYoutubeDto: CreateMainYoutubeDto) {
    let thumb_url = null;
    if (createMainYoutubeDto.video_url) {
      thumb_url = getYoutubeThumbUrl(createMainYoutubeDto.video_url);
    }
    return await this.mainYoutubeRepository.save({
      ...createMainYoutubeDto,
      thumb_url,
    });
  }

  async getItemList(
    pageOptionsDto: SearchMainYoutubeDto,
  ): Promise<PageDto<MainYoutube>> {
    const queryBuilder =
      this.mainYoutubeRepository.createQueryBuilder('main_youtubes');

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
    // return this.mainYoutubeRepository.find();
  }

  findOne(id: number): Promise<MainYoutube> {
    return this.mainYoutubeRepository.findOneBy({ id: id });
  }

  async update(id: number, updateMainYoutubeDto: UpdateMainYoutubeDto) {
    const mainYoutube = await this.findOne(id);
    if (mainYoutube) {
      let thumb_url = mainYoutube.thumb_url;
      if (updateMainYoutubeDto.video_url) {
        thumb_url = getYoutubeThumbUrl(updateMainYoutubeDto.video_url);
      }
      return await this.mainYoutubeRepository.update(id, {
        ...updateMainYoutubeDto,
        thumb_url,
      });
    }
    return;
  }

  async remove(id: number) {
    return await this.mainYoutubeRepository.delete(id);
  }
  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.mainYoutubeRepository.update(id, { seq: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

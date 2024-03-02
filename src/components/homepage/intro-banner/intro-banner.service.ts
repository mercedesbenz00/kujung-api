import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIntroBannerDto } from './dto/create-intro-banner.dto';
import { UpdateIntroBannerDto } from './dto/update-intro-banner.dto';
import { IntroBanner } from './entities/intro-banner.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchIntroBannerDto } from './dto/search-intro-banner.dto';
import { getYoutubeThumbUrl } from '../../../shared/utils';

@Injectable()
export class IntroBannerService {
  constructor(
    @InjectRepository(IntroBanner)
    private introBannerRepository: Repository<IntroBanner>,
  ) {}
  async create(createIntroBannerDto: CreateIntroBannerDto) {
    if (createIntroBannerDto.video_url) {
      let thumb_url = null;
      thumb_url = getYoutubeThumbUrl(createIntroBannerDto.video_url);
      return await this.introBannerRepository.save({
        ...createIntroBannerDto,
        thumb_url,
      });
    } else {
      return await this.introBannerRepository.save(createIntroBannerDto);
    }
  }

  async getItemList(
    pageOptionsDto: SearchIntroBannerDto,
  ): Promise<PageDto<IntroBanner>> {
    const queryBuilder =
      this.introBannerRepository.createQueryBuilder('intro_banners');

    if (pageOptionsDto.enabled !== undefined) {
      queryBuilder.where('enabled = :enabled', {
        enabled: pageOptionsDto.enabled,
      });
    }
    queryBuilder
      .orderBy(
        !!pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'updated_at',
        pageOptionsDto.order,
      )
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
    // return this.introBannerRepository.find();
  }

  findOne(id: number): Promise<IntroBanner> {
    return this.introBannerRepository.findOneBy({ id: id });
  }

  async update(id: number, updateIntroBannerDto: UpdateIntroBannerDto) {
    const introBanner = await this.findOne(id);

    if (introBanner) {
      if (updateIntroBannerDto.video_url) {
        let thumb_url = introBanner.thumb_url;
        thumb_url = getYoutubeThumbUrl(updateIntroBannerDto.video_url);
        return await this.introBannerRepository.update(id, {
          ...updateIntroBannerDto,
          thumb_url,
        });
      } else {
        return await this.introBannerRepository.update(
          id,
          updateIntroBannerDto,
        );
      }
    } else {
      if (updateIntroBannerDto.video_url) {
        let thumb_url = null;
        thumb_url = getYoutubeThumbUrl(updateIntroBannerDto.video_url);
        return await this.introBannerRepository.save({
          id: 1,
          ...updateIntroBannerDto,
          thumb_url,
        });
      } else {
        return await this.introBannerRepository.save({
          id: 1,
          ...updateIntroBannerDto,
        });
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMainBannerDto } from './dto/create-main-banner.dto';
import { UpdateMainBannerDto } from './dto/update-main-banner.dto';
import { MainBanner } from './entities/main-banner.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchMainBannerDto } from './dto/search-main-banner.dto';
import { getYoutubeThumbUrl } from './../../../shared/utils';

@Injectable()
export class MainBannerService {
  constructor(
    @InjectRepository(MainBanner)
    private mainBannerRepository: Repository<MainBanner>,
  ) {}
  async create(createMainBannerDto: CreateMainBannerDto) {
    if (createMainBannerDto.video_url) {
      let thumb_url = null;
      thumb_url = getYoutubeThumbUrl(createMainBannerDto.video_url);
      return await this.mainBannerRepository.save({
        ...createMainBannerDto,
        thumb_url,
      });
    } else {
      return await this.mainBannerRepository.save(createMainBannerDto);
    }
  }

  async getItemList(
    pageOptionsDto: SearchMainBannerDto,
  ): Promise<PageDto<MainBanner>> {
    const queryBuilder =
      this.mainBannerRepository.createQueryBuilder('main_banners');

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
    // return this.mainBannerRepository.find();
  }

  findOne(id: number): Promise<MainBanner> {
    return this.mainBannerRepository.findOneBy({ id: id });
  }

  async update(id: number, updateMainBannerDto: UpdateMainBannerDto) {
    const mainBanner = await this.findOne(id);

    if (mainBanner) {
      if (updateMainBannerDto.video_url) {
        let thumb_url = mainBanner.thumb_url;
        thumb_url = getYoutubeThumbUrl(updateMainBannerDto.video_url);
        return await this.mainBannerRepository.update(id, {
          ...updateMainBannerDto,
          thumb_url,
        });
      } else {
        return await this.mainBannerRepository.update(id, updateMainBannerDto);
      }
    }
    return;
  }

  async remove(id: number) {
    return await this.mainBannerRepository.delete(id);
  }
}

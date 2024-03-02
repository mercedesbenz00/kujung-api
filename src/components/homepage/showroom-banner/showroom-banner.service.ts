import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShowroomBannerDto } from './dto/create-showroom-banner.dto';
import { UpdateShowroomBannerDto } from './dto/update-showroom-banner.dto';
import { ShowroomBanner } from './entities/showroom-banner.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchShowroomBannerDto } from './dto/search-showroom-banner.dto';
import { getYoutubeThumbUrl } from '../../../shared/utils';

@Injectable()
export class ShowroomBannerService {
  constructor(
    @InjectRepository(ShowroomBanner)
    private showroomBannerRepository: Repository<ShowroomBanner>,
  ) {}
  async create(createShowroomBannerDto: CreateShowroomBannerDto) {
    return await this.showroomBannerRepository.save(createShowroomBannerDto);
  }

  async getItemList(
    pageOptionsDto: SearchShowroomBannerDto,
  ): Promise<PageDto<ShowroomBanner>> {
    const queryBuilder =
      this.showroomBannerRepository.createQueryBuilder('showroom_banners');

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
    // return this.showroomBannerRepository.find();
  }

  findOne(id: number): Promise<ShowroomBanner> {
    return this.showroomBannerRepository.findOneBy({ id: id });
  }

  async update(id: number, updateShowroomBannerDto: UpdateShowroomBannerDto) {
    const showroomBanner = await this.findOne(id);

    if (showroomBanner) {
      return await this.showroomBannerRepository.update(
        id,
        updateShowroomBannerDto,
      );
    } else {
      return await this.showroomBannerRepository.save({
        id: id,
        ...updateShowroomBannerDto,
      });
    }
  }

  async remove(id: number) {
    return await this.showroomBannerRepository.delete(id);
  }
}

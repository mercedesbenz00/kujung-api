import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSmartStoreBannerDto } from './dto/create-smart-store-banner.dto';
import { UpdateSmartStoreBannerDto } from './dto/update-smart-store-banner.dto';
import { SmartStoreBanner } from './entities/smart-store-banner.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { SearchSmartStoreBannerDto } from './dto/search-smart-store-banner.dto';

@Injectable()
export class SmartStoreBannerService {
  constructor(
    @InjectRepository(SmartStoreBanner)
    private smartStoreBannerRepository: Repository<SmartStoreBanner>,
  ) {}
  async create(createSmartStoreBannerDto: CreateSmartStoreBannerDto) {
    return await this.smartStoreBannerRepository.save(
      createSmartStoreBannerDto,
    );
  }

  async getItemList(
    pageOptionsDto: SearchSmartStoreBannerDto,
  ): Promise<PageDto<SmartStoreBanner>> {
    const queryBuilder = this.smartStoreBannerRepository.createQueryBuilder(
      'smart_store_banners',
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
    // return this.smartStoreBannerRepository.find();
  }

  findOne(id: number): Promise<SmartStoreBanner> {
    return this.smartStoreBannerRepository.findOneBy({ id: id });
  }

  async update(
    id: number,
    updateSmartStoreBannerDto: UpdateSmartStoreBannerDto,
  ) {
    const smartStoreBanner = await this.findOne(id);

    if (smartStoreBanner) {
      return await this.smartStoreBannerRepository.update(
        id,
        updateSmartStoreBannerDto,
      );
    }
    return;
  }

  async remove(id: number) {
    return await this.smartStoreBannerRepository.delete(id);
  }
}

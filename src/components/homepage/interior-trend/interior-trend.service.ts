import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInteriorTrendDto } from './dto/create-interior-trend.dto';
import { UpdateInteriorTrendDto } from './dto/update-interior-trend.dto';
import { InteriorTrend } from './entities/interior-trend.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchInteriorTrendDto } from './dto/search-interior-trend.dto';
import { getYoutubeThumbUrl } from '../../../shared/utils';

@Injectable()
export class InteriorTrendService {
  constructor(
    @InjectRepository(InteriorTrend)
    private interiorTrendRepository: Repository<InteriorTrend>,
  ) {}
  async create(createInteriorTrendDto: CreateInteriorTrendDto) {
    if (createInteriorTrendDto.video_url) {
      let thumb_url = null;
      thumb_url = getYoutubeThumbUrl(createInteriorTrendDto.video_url);
      return await this.interiorTrendRepository.save({
        ...createInteriorTrendDto,
        thumb_url,
      });
    } else {
      return await this.interiorTrendRepository.save(createInteriorTrendDto);
    }
  }

  async getItemList(
    pageOptionsDto: SearchInteriorTrendDto,
  ): Promise<PageDto<InteriorTrend>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.interiorTrendRepository
        .createQueryBuilder('interior_trends')
        .select([
          'interior_trends.id',
          'interior_trends.title',
          'interior_trends.summary',
          'interior_trends.video_url',
          'interior_trends.thumb_url',
          'interior_trends.created_at',
          'interior_trends.updated_at',
        ]);
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(interior_trends.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `interior_trends.created_at BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
        query = query.andWhere(
          `interior_trends.created_at BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`interior_trends.created_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`interior_trends.created_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`interior_trends.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.interiorTrendRepository.count({
          where: whereGlobalCondition,
        });
      }
      const pageMetaDto = new PageMetaDto({
        totalCount,
        pageOptionsDto,
        allCount,
      });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number): Promise<InteriorTrend> {
    return this.interiorTrendRepository.findOneBy({ id: id });
  }

  async update(id: number, updateInteriorTrendDto: UpdateInteriorTrendDto) {
    const interiorTrend = await this.findOne(id);

    if (interiorTrend) {
      if (updateInteriorTrendDto.video_url) {
        let thumb_url = interiorTrend.thumb_url;
        thumb_url = getYoutubeThumbUrl(updateInteriorTrendDto.video_url);
        return await this.interiorTrendRepository.update(id, {
          ...updateInteriorTrendDto,
          thumb_url,
        });
      } else {
        return await this.interiorTrendRepository.update(
          id,
          updateInteriorTrendDto,
        );
      }
    }
    return;
  }

  async remove(id: number) {
    return await this.interiorTrendRepository.delete(id);
  }
}

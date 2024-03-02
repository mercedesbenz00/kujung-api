import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateManagementLawDto } from './dto/create-management-law.dto';
import { UpdateManagementLawDto } from './dto/update-management-law.dto';
import { ManagementLaw } from './entities/management-law.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SearchManagementLawDto } from './dto/search-management-law.dto';
import { getYoutubeThumbUrl } from '../../../shared/utils';

@Injectable()
export class ManagementLawService {
  constructor(
    @InjectRepository(ManagementLaw)
    private managementLawRepository: Repository<ManagementLaw>,
  ) {}
  async create(createManagementLawDto: CreateManagementLawDto) {
    if (createManagementLawDto.video_url) {
      let thumb_url = null;
      thumb_url = getYoutubeThumbUrl(createManagementLawDto.video_url);
      return await this.managementLawRepository.save({
        ...createManagementLawDto,
        thumb_url,
      });
    } else {
      return await this.managementLawRepository.save(createManagementLawDto);
    }
  }

  async getItemList(
    pageOptionsDto: SearchManagementLawDto,
  ): Promise<PageDto<ManagementLaw>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.managementLawRepository
        .createQueryBuilder('management_laws')
        .select([
          'management_laws.id',
          'management_laws.title',
          'management_laws.summary',
          'management_laws.video_url',
          'management_laws.thumb_url',
          'management_laws.created_at',
          'management_laws.updated_at',
        ]);
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(management_laws.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `management_laws.created_at BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
        query = query.andWhere(
          `management_laws.created_at BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`management_laws.created_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`management_laws.created_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`management_laws.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.managementLawRepository.count({
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

  findOne(id: number): Promise<ManagementLaw> {
    return this.managementLawRepository.findOneBy({ id: id });
  }

  async update(id: number, updateManagementLawDto: UpdateManagementLawDto) {
    const managementLaw = await this.findOne(id);

    if (managementLaw) {
      if (updateManagementLawDto.video_url) {
        let thumb_url = managementLaw.thumb_url;
        thumb_url = getYoutubeThumbUrl(updateManagementLawDto.video_url);
        return await this.managementLawRepository.update(id, {
          ...updateManagementLawDto,
          thumb_url,
        });
      } else {
        return await this.managementLawRepository.update(
          id,
          updateManagementLawDto,
        );
      }
    }
    return;
  }

  async remove(id: number) {
    return await this.managementLawRepository.delete(id);
  }
}

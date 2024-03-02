import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { SearchCatalogDto } from './dto/search-catalog.dto';
import { Catalog } from './entities/catalog.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private catalogRepository: Repository<Catalog>,
  ) {}
  async create(createCatalogDto: CreateCatalogDto) {
    try {
      const newCatalog = new Catalog();
      newCatalog.title = createCatalogDto.title;
      newCatalog.summary = createCatalogDto.summary;
      newCatalog.category = createCatalogDto.category;
      newCatalog.download_file = createCatalogDto.download_file;
      newCatalog.preview_file = createCatalogDto.preview_file;
      newCatalog.thumb_url = createCatalogDto.thumb_url;
      newCatalog.thumb_url_mobile = createCatalogDto.thumb_url_mobile;

      return await this.catalogRepository.save(newCatalog);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchCatalogDto,
  ): Promise<PageDto<Catalog>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.catalogRepository
        .createQueryBuilder('catalogs')
        .select([
          'catalogs.id',
          'catalogs.title',
          'catalogs.summary',
          'catalogs.category',
          'catalogs.download_file',
          'catalogs.preview_file',
          'catalogs.thumb_url',
          'catalogs.thumb_url_mobile',
          'catalogs.created_at',
          'catalogs.updated_at',
        ]);

      if (pageOptionsDto.categoryList && pageOptionsDto.categoryList.length) {
        query = query.andWhere(`catalogs.category IN (:...categoryList)`, {
          categoryList: pageOptionsDto.categoryList,
        });
      }
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(catalogs.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(`catalogs.created_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
        query = query.andWhere(`catalogs.created_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`catalogs.created_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`catalogs.created_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`catalogs.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.catalogRepository.count({
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

  async findOne(id: number): Promise<any> {
    const catalog = await this.catalogRepository.findOne({
      where: { id: id },
    });
    return catalog;
  }

  async update(id: number, updateCatalogDto: UpdateCatalogDto) {
    try {
      const catalog = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateCatalogDto[field] !== undefined)
          catalog[field] = updateCatalogDto[field];
      };

      if (catalog) {
        updateValue('title');
        updateValue('summary');
        updateValue('category');
        updateValue('download_file');
        updateValue('preview_file');
        updateValue('thumb_url');
        updateValue('thumb_url_mobile');
        return await this.catalogRepository.save(catalog);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.catalogRepository.delete(id);
  }
}

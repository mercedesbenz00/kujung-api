import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgencyStoreDto } from './dto/create-agency-store.dto';
import { UpdateAgencyStoreDto } from './dto/update-agency-store.dto';
import { SearchAgencyStoreDto } from './dto/search-agency-store.dto';
import { AgencyStore } from './entities/agency-store.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { AgencyStoreImage } from './entities/agency-store-image.entity';
import { CommonConstantService } from '../../common-constant/common-constant.service';

@Injectable()
export class AgencyStoreService {
  constructor(
    private commonConstantService: CommonConstantService,
    @InjectRepository(AgencyStore)
    private agencyStoreRepository: Repository<AgencyStore>,
    @InjectRepository(AgencyStoreImage)
    private agencyStoreImageRepository: Repository<AgencyStoreImage>,
  ) {}
  async create(createAgencyStoreDto: CreateAgencyStoreDto) {
    try {
      const newAgencyStore = new AgencyStore();
      if (createAgencyStoreDto.area_code !== undefined) {
        if (createAgencyStoreDto.area_code === 0) {
          const strAreaValue = createAgencyStoreDto.addr.split(' ')[0];
          let codeInfo = await this.commonConstantService.findCode(
            'area_code',
            strAreaValue,
          );
          if (!codeInfo) {
            codeInfo = await this.commonConstantService.create({
              type: 'area_code',
              name: strAreaValue,
            });
          }
          newAgencyStore.area_info = new CommonConstant();
          newAgencyStore.area_info.id = codeInfo.id;
        } else {
          newAgencyStore.area_info = new CommonConstant();
          newAgencyStore.area_info.id = createAgencyStoreDto.area_code;
        }
      }
      newAgencyStore.name = createAgencyStoreDto.name;
      newAgencyStore.addr = createAgencyStoreDto.addr;
      newAgencyStore.addr_sub = createAgencyStoreDto.addr_sub;
      newAgencyStore.zonecode = createAgencyStoreDto.zonecode;
      newAgencyStore.phone = createAgencyStoreDto.phone;
      newAgencyStore.feature = createAgencyStoreDto.feature;
      newAgencyStore.is_gold = createAgencyStoreDto.is_gold;
      newAgencyStore.opening_hours = createAgencyStoreDto.opening_hours;
      newAgencyStore.priority = createAgencyStoreDto.priority;
      newAgencyStore.image_url = createAgencyStoreDto.image_url;
      newAgencyStore.image_url_mobile = createAgencyStoreDto.image_url_mobile;
      newAgencyStore.lng = createAgencyStoreDto.lng;
      newAgencyStore.lat = createAgencyStoreDto.lat;

      if (createAgencyStoreDto.agencyStoreImages) {
        newAgencyStore.agencyStoreImages = [];
        for (const agencyStoreImage of createAgencyStoreDto.agencyStoreImages) {
          const agencyStoreImageEntity = new AgencyStoreImage();
          agencyStoreImageEntity.image_url = agencyStoreImage.image_url;
          newAgencyStore.agencyStoreImages.push(agencyStoreImageEntity);
        }
      }

      return await this.agencyStoreRepository.save(newAgencyStore);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findNearbyStores(
    pageOptionsDto: SearchAgencyStoreDto,
  ): Promise<PageDto<any>> {
    const earthRadiusKm = 6371; // Earth radius in kilometers

    const lat = pageOptionsDto.lat;
    const lng = pageOptionsDto.lng;
    const whereQueryList = [];
    if (pageOptionsDto.area_list && pageOptionsDto.area_list.length) {
      whereQueryList.push(
        `agency_store.area_code IN (${pageOptionsDto.area_list
          .map((area_code) => `'${area_code}'`)
          .join(',')})`,
      );
    }
    if (pageOptionsDto.q !== undefined) {
      whereQueryList.push(
        `LOWER(agency_store.${pageOptionsDto.q_type}) LIKE LOWER('%${pageOptionsDto.q}%')`,
      );
    }

    const queryDateType = pageOptionsDto.date_type || 'updated_at';
    if (pageOptionsDto.from && pageOptionsDto.to) {
      whereQueryList.push(
        `agency_store.${queryDateType} BETWEEN ${new Date(
          pageOptionsDto.from,
        )} AND ${new Date(pageOptionsDto.to)}`,
      );
    } else if (pageOptionsDto.from) {
      whereQueryList.push(
        `agency_store.${queryDateType} >= ${new Date(pageOptionsDto.from)}`,
      );
    } else if (pageOptionsDto.to) {
      whereQueryList.push(
        `agency_store.${queryDateType} <= ${new Date(pageOptionsDto.to)}`,
      );
    }
    if (pageOptionsDto.is_gold !== undefined) {
      whereQueryList.push(
        `agency_store.is_gold = ${pageOptionsDto.is_gold ? 1 : 0}`,
      );
    }

    const mainQuery = `
    SELECT
      agency_store.id,
      agency_store.name,
      agency_store.addr,
      agency_store.addr_sub,
      agency_store.zonecode,
      agency_store.phone,
      agency_store.feature,
      agency_store.is_gold,
      agency_store.opening_hours,
      agency_store.priority,
      agency_store.lng,
      agency_store.lat,
      agency_store.image_url,
      agency_store.image_url_mobile,
      agency_store.updated_at,
      agency_store.area_code,
      JSON_OBJECT(
        'id', common_constants.id,
        'name', common_constants.name,
        'type', common_constants.type
      ) AS area_info,
      JSON_ARRAYAGG(JSON_OBJECT(
        'id', agency_store_images.id,
        'image_url', agency_store_images.image_url
      )) AS agencyStoreImages,
      (${earthRadiusKm} * acos(cos(radians(${lat})) * cos(radians(agency_store.lat)) * cos(radians(agency_store.lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(agency_store.lat)))) AS distance
      FROM
        agency_stores AS agency_store
      LEFT JOIN
        common_constants ON agency_store.area_code = common_constants.id
      LEFT JOIN
        agency_store_images ON agency_store.id = agency_store_images.agency_store_id
      ${whereQueryList.length ? 'WHERE ' + whereQueryList.join(' AND ') : ''}
      GROUP BY
        agency_store.id
    `;
    let query = `
      ${mainQuery}
      ORDER BY
        distance ASC,
        agency_store.id ASC
    `;

    if (pageOptionsDto.take) {
      query = `${query}
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.skip};
      `;
    }

    const totalCountQuery = `
    SELECT COUNT(*) AS total_count
    FROM (${mainQuery}) A
    `;

    const totalCountQueryResult = await this.agencyStoreRepository.query(
      totalCountQuery,
    );
    const totalCount = Number(totalCountQueryResult[0].total_count);

    const nearestAgencyStores = await this.agencyStoreRepository.query(query);

    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.agencyStoreRepository.count();
    }

    const pageMetaDto = new PageMetaDto({
      totalCount: totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(
      nearestAgencyStores.reduce((newArray, row) => {
        const entity = row;
        if (entity.agencyStoreImages) {
          entity.agencyStoreImages = JSON.parse(entity.agencyStoreImages);
        }
        if (entity.area_info) {
          entity.area_info = JSON.parse(entity.area_info);
        }
        if (entity.id) {
          newArray.push(entity);
        }
        return newArray;
      }, []),
      pageMetaDto,
    );
  }

  async getItemList(
    pageOptionsDto: SearchAgencyStoreDto,
  ): Promise<PageDto<any>> {
    const whereQueryList = [];
    if (pageOptionsDto.area_list && pageOptionsDto.area_list.length) {
      whereQueryList.push(
        `agency_store.area_code IN (${pageOptionsDto.area_list
          .map((area_code) => `'${area_code}'`)
          .join(',')})`,
      );
    }
    if (pageOptionsDto.q !== undefined) {
      whereQueryList.push(
        `LOWER(agency_store.${pageOptionsDto.q_type}) LIKE LOWER('%${pageOptionsDto.q}%')`,
      );
    }

    const queryDateType = pageOptionsDto.date_type || 'updated_at';
    if (pageOptionsDto.from && pageOptionsDto.to) {
      whereQueryList.push(
        `agency_store.${queryDateType} BETWEEN ${new Date(
          pageOptionsDto.from,
        )} AND ${new Date(pageOptionsDto.to)}`,
      );
    } else if (pageOptionsDto.from) {
      whereQueryList.push(
        `agency_store.${queryDateType} >= ${new Date(pageOptionsDto.from)}`,
      );
    } else if (pageOptionsDto.to) {
      whereQueryList.push(
        `agency_store.${queryDateType} <= ${new Date(pageOptionsDto.to)}`,
      );
    }
    if (pageOptionsDto.is_gold !== undefined) {
      whereQueryList.push(
        `agency_store.is_gold = ${pageOptionsDto.is_gold ? 1 : 0}`,
      );
    }

    const mainQuery = `
    SELECT
      agency_store.id,
      agency_store.name,
      agency_store.addr,
      agency_store.addr_sub,
      agency_store.zonecode,
      agency_store.phone,
      agency_store.feature,
      agency_store.is_gold,
      agency_store.opening_hours,
      agency_store.priority,
      agency_store.lng,
      agency_store.lat,
      agency_store.image_url,
      agency_store.image_url_mobile,
      agency_store.updated_at,
      agency_store.area_code,
      JSON_OBJECT(
        'id', common_constants.id,
        'name', common_constants.name,
        'type', common_constants.type
      ) AS area_info,
      JSON_ARRAYAGG(JSON_OBJECT(
        'id', agency_store_images.id,
        'image_url', agency_store_images.image_url
      )) AS agencyStoreImages
      FROM
        agency_stores AS agency_store
      LEFT JOIN
        common_constants ON agency_store.area_code = common_constants.id
      LEFT JOIN
        agency_store_images ON agency_store.id = agency_store_images.agency_store_id
      ${whereQueryList.length ? 'WHERE ' + whereQueryList.join(' AND ') : ''}
      GROUP BY
        agency_store.id
    `;
    let query = `
      ${mainQuery}
      ORDER BY
        is_gold DESC
    `;

    if (pageOptionsDto.sortBy) {
      query = `${query}, ${pageOptionsDto.sortBy} ${pageOptionsDto.order}`;
    }

    query = `${query}, RAND()`;

    if (pageOptionsDto.take) {
      query = `${query}
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.skip};
      `;
    }

    const totalCountQuery = `
    SELECT COUNT(*) AS total_count
    FROM (${mainQuery}) A
    `;

    const totalCountQueryResult = await this.agencyStoreRepository.query(
      totalCountQuery,
    );
    const totalCount = Number(totalCountQueryResult[0].total_count);

    const nearestAgencyStores = await this.agencyStoreRepository.query(query);

    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.agencyStoreRepository.count();
    }

    const pageMetaDto = new PageMetaDto({
      totalCount: totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(
      nearestAgencyStores.reduce((newArray, row) => {
        const entity = row;
        if (entity.agencyStoreImages) {
          entity.agencyStoreImages = JSON.parse(entity.agencyStoreImages);
        }
        if (entity.area_info) {
          entity.area_info = JSON.parse(entity.area_info);
        }
        if (entity.id) {
          newArray.push(entity);
        }
        return newArray;
      }, []),
      pageMetaDto,
    );
  }

  async getItemListDeprecated(
    pageOptionsDto: SearchAgencyStoreDto,
  ): Promise<PageDto<AgencyStore>> {
    try {
      const orderBy = pageOptionsDto.sortBy;
      let query = this.agencyStoreRepository
        .createQueryBuilder('agency_stores')
        .leftJoinAndSelect('agency_stores.area_info', 'area_info')
        .leftJoinAndSelect(
          'agency_stores.agencyStoreImages',
          'agencyStoreImages',
        )
        .select([
          'agency_stores.id',
          'area_info',
          'agencyStoreImages',
          'agency_stores.name',
          'agency_stores.addr',
          'agency_stores.addr_sub',
          'agency_stores.area_code',
          'agency_stores.zonecode',
          'agency_stores.phone',
          'agency_stores.feature',
          'agency_stores.is_gold',
          'agency_stores.opening_hours',
          'agency_stores.priority',
          'agency_stores.lng',
          'agency_stores.lat',
          'agency_stores.image_url',
          'agency_stores.image_url_mobile',
          'agency_stores.created_at',
          'agency_stores.updated_at',
        ]);

      const fields = [
        'id',
        'name',
        'addr',
        'phone',
        'created_at',
        'updated_at',
      ];
      if (pageOptionsDto.area_list && pageOptionsDto.area_list.length) {
        query = query.andWhere(`area_info.id IN (:...area_list)`, {
          area_list: pageOptionsDto.area_list,
        });
      }
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(agency_stores.${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      const queryDateType = pageOptionsDto.date_type || 'updated_at';
      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `agency_stores.${queryDateType} BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`agency_stores.${queryDateType} >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`agency_stores.${queryDateType} <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }
      if (pageOptionsDto.is_gold !== undefined) {
        query = query.andWhere(`agency_stores.is_gold = :is_gold`, {
          is_gold: pageOptionsDto.is_gold,
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`agency_stores.is_gold`, 'DESC');

      if (orderBy) {
        query = query.addOrderBy(
          `agency_stores.${orderBy}`,
          pageOptionsDto.order,
        );
      }
      // RAND() does not work, seems typeorm has issue
      // query = query.addOrderBy(`RAND()`);
      // const i = Math.floor(Math.random() * fields.length);
      // query = query.addOrderBy(`agency_stores.${fields[i]}`);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.agencyStoreRepository.count({
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
    const agencyStore = await this.agencyStoreRepository.findOne({
      where: { id: id },
      relations: {
        agencyStoreImages: true,
        area_info: true,
      },
    });
    return agencyStore;
  }

  async update(id: number, updateAgencyStoreDto: UpdateAgencyStoreDto) {
    try {
      const agencyStore = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateAgencyStoreDto[field] !== undefined)
          agencyStore[field] = updateAgencyStoreDto[field];
      };

      if (agencyStore) {
        updateValue('name');
        updateValue('addr');
        updateValue('addr_sub');
        updateValue('zonecode');
        updateValue('phone');
        updateValue('feature');
        updateValue('is_gold');
        updateValue('opening_hours');
        updateValue('priority');
        updateValue('lng');
        updateValue('lat');
        updateValue('image_url');
        updateValue('image_url_mobile');

        if (updateAgencyStoreDto.area_code === 0) {
          const strAreaValue = updateAgencyStoreDto.addr.split(' ')[0];
          let codeInfo = await this.commonConstantService.findCode(
            'area_code',
            strAreaValue,
          );
          if (!codeInfo) {
            codeInfo = await this.commonConstantService.create({
              type: 'area_code',
              name: strAreaValue,
            });
          }
          agencyStore.area_info = new CommonConstant();
          agencyStore.area_info.id = codeInfo.id;
        } else {
          agencyStore.area_info = new CommonConstant();
          agencyStore.area_info.id = updateAgencyStoreDto.area_code;
        }

        if (updateAgencyStoreDto.agencyStoreImages) {
          if (agencyStore.agencyStoreImages) {
            // Find the images to remove
            const imagesToRemove = agencyStore.agencyStoreImages.filter(
              (existingImage) => {
                return !updateAgencyStoreDto.agencyStoreImages.some(
                  (newImage) => newImage.id === existingImage.id,
                );
              },
            );

            // Delete the images that are no longer associated with the entity
            if (imagesToRemove.length) {
              await this.agencyStoreImageRepository.remove(imagesToRemove);
            }
          }
          agencyStore.agencyStoreImages = [];
          for (const agencyStoreImage of updateAgencyStoreDto.agencyStoreImages) {
            const agencyStoreImageEntity = new AgencyStoreImage();
            if (agencyStoreImage.id) {
              agencyStoreImageEntity.id = agencyStoreImage.id;
            }
            agencyStoreImageEntity.image_url = agencyStoreImage.image_url;
            agencyStore.agencyStoreImages.push(agencyStoreImageEntity);
          }
        }
        return await this.agencyStoreRepository.save(agencyStore);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.agencyStoreRepository.delete(id);
  }
}

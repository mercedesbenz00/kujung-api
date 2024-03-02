import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CreateSmartcareServiceDto } from './dto/create-smartcare-service.dto';
import { UpdateSmartcareServiceDto } from './dto/update-smartcare-service.dto';
import { SearchSmartcareServiceDto } from './dto/search-smartcare-service.dto';
import { SmartcareService } from './entities/smartcare-service.entity';
import { User } from '../../users/entities/user.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { SmartcareServiceImage } from './entities/smartcare-service-image.entity';
@Injectable()
export class SmartcareServiceService {
  constructor(
    @InjectRepository(SmartcareService)
    private smartcareServiceRepository: Repository<SmartcareService>,
    @InjectRepository(SmartcareServiceImage)
    private smartcareServiceImageRepository: Repository<SmartcareServiceImage>,
  ) {}
  async create(createSmartcareServiceDto: CreateSmartcareServiceDto) {
    try {
      const newSmartcareService = new SmartcareService();
      if (createSmartcareServiceDto.requester_id) {
        newSmartcareService.requester = new User();
        newSmartcareService.requester.id =
          createSmartcareServiceDto.requester_id;
      }
      newSmartcareService.quote_url = createSmartcareServiceDto.quote_url;
      newSmartcareService.product_name = createSmartcareServiceDto.product_name;
      newSmartcareService.special_note = createSmartcareServiceDto.special_note;
      newSmartcareService.name = createSmartcareServiceDto.name;
      newSmartcareService.addr = createSmartcareServiceDto.addr;
      newSmartcareService.addr_sub = createSmartcareServiceDto.addr_sub;
      newSmartcareService.zonecode = createSmartcareServiceDto.zonecode;
      newSmartcareService.phone = createSmartcareServiceDto.phone;
      newSmartcareService.know_from = createSmartcareServiceDto.know_from;
      newSmartcareService.current_floor =
        createSmartcareServiceDto.current_floor;
      newSmartcareService.area_range = createSmartcareServiceDto.area_range;
      newSmartcareService.contact_time = createSmartcareServiceDto.contact_time;

      if (createSmartcareServiceDto.smartcareServiceImages) {
        newSmartcareService.smartcareServiceImages = [];
        for (const smartcareServiceImage of createSmartcareServiceDto.smartcareServiceImages) {
          const smartcareServiceImageEntity = new SmartcareServiceImage();
          smartcareServiceImageEntity.image_url =
            smartcareServiceImage.image_url;
          newSmartcareService.smartcareServiceImages.push(
            smartcareServiceImageEntity,
          );
        }
      }

      if (createSmartcareServiceDto.desired_services) {
        newSmartcareService.desired_services =
          createSmartcareServiceDto.desired_services.join('||');
      }

      return await this.smartcareServiceRepository.save(newSmartcareService);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchSmartcareServiceDto,
  ): Promise<PageDto<any>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.smartcareServiceRepository
        .createQueryBuilder('smartcare_services')
        .leftJoinAndSelect(
          'smartcare_services.smartcareServiceImages',
          'smartcareServiceImages',
        )
        .leftJoinAndSelect('smartcare_services.requester', 'requester')
        .leftJoinAndSelect('smartcare_services.smartcareServiceMemos', 'memos')
        .select([
          'smartcare_services.id',
          'smartcareServiceImages',
          'memos',
          'requester.id',
          'smartcare_services.name',
          'smartcare_services.addr',
          'smartcare_services.addr_sub',
          'smartcare_services.zonecode',
          'smartcare_services.phone',
          'smartcare_services.know_from',
          'smartcare_services.desired_services',
          'smartcare_services.current_floor',
          'smartcare_services.area_range',
          'smartcare_services.special_note',
          'smartcare_services.product_name',
          'smartcare_services.quote_url',
          'smartcare_services.status',
          'smartcare_services.contact_time',
          'smartcare_services.updated_at',
          'smartcare_services.created_at',
        ]);
      if (pageOptionsDto.q !== undefined) {
        if (pageOptionsDto.q_type === 'addr') {
          query = query.andWhere(
            new Brackets((qb) => {
              qb.where(
                `LOWER(smartcare_services.addr_sub) LIKE LOWER(:pattern)`,
                {
                  pattern: `%${pageOptionsDto.q}%`,
                },
              ).orWhere(`LOWER(smartcare_services.addr) LIKE LOWER(:addr)`, {
                addr: `%${pageOptionsDto.q}%`,
              });
            }),
          );
        } else {
          query = query.andWhere(
            `LOWER(smartcare_services.${
              pageOptionsDto.q_type || 'name'
            }) LIKE LOWER(:pattern)`,
            {
              pattern: `%${pageOptionsDto.q}%`,
            },
          );
        }
      }

      if (pageOptionsDto.requester_id !== undefined) {
        query = query.andWhere(`requester.id = :requester_id`, {
          requester_id: pageOptionsDto.requester_id,
        });
      }

      if (pageOptionsDto.status_list && pageOptionsDto.status_list.length) {
        query = query.andWhere(
          `smartcare_services.status IN (:...status_list)`,
          {
            status_list: pageOptionsDto.status_list,
          },
        );
      }

      const queryDateType = pageOptionsDto.date_type || 'updated_at';
      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `smartcare_services.${queryDateType} BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`smartcare_services.${queryDateType} >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`smartcare_services.${queryDateType} <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = pageOptionsDto.take
        ? query
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy(`smartcare_services.${orderBy}`, pageOptionsDto.order)
        : query.orderBy(`smartcare_services.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.smartcareServiceRepository.count({
          where: whereGlobalCondition,
        });
      }
      const pageMetaDto = new PageMetaDto({
        totalCount,
        pageOptionsDto,
        allCount,
      });

      return new PageDto(
        entities.map((entity) => {
          let desired_services = undefined;
          if (entity.desired_services) {
            desired_services = entity.desired_services.split('||');
          }
          return { ...entity, desired_services };
        }),
        pageMetaDto,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number, needConvert = true): Promise<any> {
    const smartcareService = await this.smartcareServiceRepository.findOne({
      where: { id: id },
      relations: {
        smartcareServiceImages: true,
      },
    });
    if (!needConvert) {
      return smartcareService;
    }
    let desired_services = undefined;
    if (needConvert && smartcareService.desired_services) {
      desired_services = smartcareService.desired_services.split('||');
    }
    return { ...smartcareService, desired_services };
  }

  async update(
    id: number,
    updateSmartcareServiceDto: UpdateSmartcareServiceDto,
  ) {
    try {
      const smartcareService = await this.findOne(id, false);
      const updateValue = (field: string) => {
        if (updateSmartcareServiceDto[field] !== undefined)
          smartcareService[field] = updateSmartcareServiceDto[field];
      };

      if (smartcareService) {
        updateValue('name');
        updateValue('addr');
        updateValue('addr_sub');
        updateValue('zonecode');
        updateValue('phone');
        updateValue('know_from');
        updateValue('current_floor');
        updateValue('area_range');
        updateValue('contact_time');
        updateValue('special_note');
        updateValue('quote_url');
        updateValue('product_name');

        if (updateSmartcareServiceDto.smartcareServiceImages) {
          if (smartcareService.smartcareServiceImages) {
            // Find the images to remove
            const imagesToRemove =
              smartcareService.smartcareServiceImages.filter(
                (existingImage) => {
                  return !updateSmartcareServiceDto.smartcareServiceImages.some(
                    (newImage) => newImage.id === existingImage.id,
                  );
                },
              );

            // Delete the images that are no longer associated with the entity
            if (imagesToRemove.length) {
              await this.smartcareServiceImageRepository.remove(imagesToRemove);
            }
          }

          smartcareService.smartcareServiceImages = [];
          for (const smartcareServiceImage of updateSmartcareServiceDto.smartcareServiceImages) {
            const smartcareServiceImageEntity = new SmartcareServiceImage();
            if (smartcareServiceImage.id) {
              smartcareServiceImageEntity.id = smartcareServiceImage.id;
            }
            smartcareServiceImageEntity.image_url =
              smartcareServiceImage.image_url;
            smartcareService.smartcareServiceImages.push(
              smartcareServiceImageEntity,
            );
          }
        }
        if (updateSmartcareServiceDto.requester_id) {
          smartcareService.requester = new User();
          smartcareService.requester.id =
            updateSmartcareServiceDto.requester_id;
        }

        if (updateSmartcareServiceDto.desired_services) {
          smartcareService.desired_services =
            updateSmartcareServiceDto.desired_services.join('||');
        }
        return await this.smartcareServiceRepository.save(smartcareService);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async updateStatus(id: number, status: number) {
    try {
      const smartcareService = await this.findOne(id, false);
      if (smartcareService) {
        smartcareService.status = status;
        return await this.smartcareServiceRepository.save(smartcareService);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.smartcareServiceRepository.delete(id);
  }
}

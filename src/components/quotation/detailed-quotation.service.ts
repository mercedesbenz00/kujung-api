import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetailedQuotationDto } from './dto/create-detailed-quotation.dto';
import { UpdateDetailedQuotationDto } from './dto/update-detailed-quotation.dto';
import { SearchDetailedQuotationDto } from './dto/search-detailed-quotation.dto';
import { DetailedQuotation } from './entities/detailed-quotation.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { CommonConstant } from '../common-constant/entities/common-constant.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { DetailedQuotationImage } from './entities/detailed-quotation-image.entity';
import { GeneralProcessStatus, Order } from '../../shared/constants';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class DetailedQuotationService {
  constructor(
    @InjectRepository(DetailedQuotation)
    private detailedQuotationRepository: Repository<DetailedQuotation>,
    @InjectRepository(DetailedQuotationImage)
    private detailedQuotationImageRepository: Repository<DetailedQuotationImage>,
  ) {}
  async create(
    createDetailedQuotationDto: CreateDetailedQuotationDto,
    userId: number = undefined,
  ) {
    try {
      const newDetailedQuotation = new DetailedQuotation();
      newDetailedQuotation.name = createDetailedQuotationDto.name;
      newDetailedQuotation.phone = createDetailedQuotationDto.phone;
      newDetailedQuotation.addr = createDetailedQuotationDto.addr;
      newDetailedQuotation.remark = createDetailedQuotationDto.remark;
      newDetailedQuotation.house_style_text =
        createDetailedQuotationDto.house_style_text;
      newDetailedQuotation.area_space_text =
        createDetailedQuotationDto.area_space_text;
      newDetailedQuotation.living_room_count =
        createDetailedQuotationDto.living_room_count;
      newDetailedQuotation.kitchen_count =
        createDetailedQuotationDto.kitchen_count;
      newDetailedQuotation.room_count = createDetailedQuotationDto.room_count;

      if (createDetailedQuotationDto.category_id !== undefined) {
        newDetailedQuotation.category = new Category();
        newDetailedQuotation.category.id =
          createDetailedQuotationDto.category_id;
      }

      newDetailedQuotation.detailedQuotationImages = [];
      for (const detailedQuotationImage of createDetailedQuotationDto.detailedQuotationImages) {
        const detailedQuotationImageEntity = new DetailedQuotationImage();
        detailedQuotationImageEntity.image_url =
          detailedQuotationImage.image_url;
        newDetailedQuotation.detailedQuotationImages.push(
          detailedQuotationImageEntity,
        );
      }

      if (userId !== undefined) {
        newDetailedQuotation.requester = new User();
        newDetailedQuotation.requester.id = userId;
        newDetailedQuotation.requested_at = new Date();
      }

      return await this.detailedQuotationRepository.save(newDetailedQuotation);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchDetailedQuotationDto,
  ): Promise<PageDto<DetailedQuotation>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.detailedQuotationRepository
        .createQueryBuilder('detailed_quotations')
        .leftJoinAndSelect('detailed_quotations.requester', 'requester')
        .leftJoinAndSelect('detailed_quotations.category', 'category')
        .leftJoinAndSelect(
          'detailed_quotations.detailedQuotationImages',
          'detailedQuotationImages',
        )
        .select([
          'detailed_quotations.id',
          'detailed_quotations.name',
          'detailed_quotations.phone',
          'detailed_quotations.addr',
          'detailedQuotationImages',
          'detailed_quotations.remark',
          'detailed_quotations.house_style_text',
          'detailed_quotations.area_space_text',
          'detailed_quotations.living_room_count',
          'detailed_quotations.kitchen_count',
          'detailed_quotations.room_count',
          'detailed_quotations.status',
          'detailed_quotations.updated_at',
          'detailed_quotations.requested_at',
          'detailed_quotations.rejected_at',
          'detailed_quotations.approved_at',
          'requester.id',
          'requester.name',
          'requester.email',
          'requester.phone',
          'requester.account_type',
          'requester.contact_name',
          'requester.addr',
          'requester.addr_sub',
          'requester.zonecode',
          'category',
        ]);
      if (pageOptionsDto.status_list && pageOptionsDto.status_list.length) {
        query = query.andWhere(
          `detailed_quotations.status IN (:...status_list)`,
          {
            status_list: pageOptionsDto.status_list,
          },
        );
      }
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(requester.${
            pageOptionsDto.q_type || 'name'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }
      if (pageOptionsDto.requester_id !== undefined) {
        query = query.andWhere(`requester.id = :requester_id`, {
          requester_id: pageOptionsDto.requester_id,
        });
      }

      const queryDateType = pageOptionsDto.date_type || 'requested_at';
      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `detailed_quotations.${queryDateType} BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(
          `detailed_quotations.${queryDateType} >= :from`,
          {
            from: new Date(pageOptionsDto.from),
          },
        );
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`detailed_quotations.${queryDateType} <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`detailed_quotations.${orderBy}`, Order.DESC);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;
      if (pageOptionsDto.needAllCount) {
        allCount = await this.detailedQuotationRepository.count();
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
    const detailedQuotation = await this.detailedQuotationRepository.findOne({
      where: { id: id },
      relations: {
        detailedQuotationImages: true,
        category: true,
        requester: true,
        statusAdmin: true,
      },
    });
    return detailedQuotation;
  }

  async update(
    id: number,
    updateDetailedQuotationDto: UpdateDetailedQuotationDto,
    userId: number = undefined,
    isAdmin = false,
  ) {
    try {
      const detailedQuotation = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateDetailedQuotationDto[field] !== undefined)
          detailedQuotation[field] = updateDetailedQuotationDto[field];
      };

      if (detailedQuotation) {
        updateValue('name');
        updateValue('phone');
        updateValue('addr');
        updateValue('remark');
        updateValue('house_style_text');
        updateValue('area_space_text');
        updateValue('living_room_count');
        updateValue('kitchen_count');
        updateValue('room_count');
        if (updateDetailedQuotationDto.category_id !== undefined) {
          detailedQuotation.category = new Category();
          detailedQuotation.category.id =
            updateDetailedQuotationDto.category_id;
        }

        if (updateDetailedQuotationDto.detailedQuotationImages) {
          if (detailedQuotation.detailedQuotationImages) {
            // Find the images to remove
            const imagesToRemove =
              detailedQuotation.detailedQuotationImages.filter(
                (existingImage) => {
                  return !updateDetailedQuotationDto.detailedQuotationImages.some(
                    (newImage) => newImage.id === existingImage.id,
                  );
                },
              );

            // Delete the images that are no longer associated with the entity
            if (imagesToRemove.length) {
              await this.detailedQuotationImageRepository.remove(
                imagesToRemove,
              );
            }
          }
          detailedQuotation.detailedQuotationImages = [];
          for (const detailedQuotationImage of updateDetailedQuotationDto.detailedQuotationImages) {
            const detailedQuotationImageEntity = new DetailedQuotationImage();
            if (detailedQuotationImage.id) {
              detailedQuotationImageEntity.id = detailedQuotationImage.id;
            }
            detailedQuotationImageEntity.image_url =
              detailedQuotationImage.image_url;
            detailedQuotation.detailedQuotationImages.push(
              detailedQuotationImageEntity,
            );
          }
        }
        if (isAdmin && updateDetailedQuotationDto.status !== undefined) {
          detailedQuotation.status = updateDetailedQuotationDto.status;
          if (
            updateDetailedQuotationDto.status === GeneralProcessStatus.APPROVED
          ) {
            detailedQuotation.approved_at = new Date();
            detailedQuotation.statusAdmin = new Admin();
            detailedQuotation.statusAdmin.id = userId;
          } else if (
            updateDetailedQuotationDto.status === GeneralProcessStatus.REJECTED
          ) {
            detailedQuotation.rejected_at = new Date();
            detailedQuotation.statusAdmin = new Admin();
            detailedQuotation.statusAdmin.id = userId;
          }
        }

        if (!isAdmin && userId !== undefined) {
          detailedQuotation.updated_by = userId;
        }
        return await this.detailedQuotationRepository.save(detailedQuotation);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.detailedQuotationRepository.delete(id);
  }
}

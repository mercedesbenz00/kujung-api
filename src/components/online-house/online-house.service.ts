import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOnlineHouseDto } from './dto/create-online-house.dto';
import { UpdateOnlineHouseDto } from './dto/update-online-house.dto';
import { SearchOnlineHouseDto } from './dto/search-online-house.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { OnlineHouse } from './entities/online-house.entity';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Label } from '../label/entities/label.entity';
import { CommonConstant } from '../common-constant/entities/common-constant.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { OnlineHouseImage } from './entities/online-house-image.entity';
import { OnlineHousePopularity } from './entities/online-house-popularity.entity';
import { OnlineHouseLikeCount } from './entities/online-house-like-count.entity';
import {
  GeneralProcessStatus,
  Order,
  LikeEntityType,
  WishEntityType,
  ViewLogEntityType,
} from '../../shared/constants';
import { Admin } from '../admin/entities/admin.entity';
import { Like } from './../like/entities/like.entity';
import { Wish } from './../wish/entities/wish.entity';
import { ViewLogService } from '../view-log/view-log.service';
import { PointLogService } from '../point-log/point-log.service';
import { PointType } from '../../shared/constants';

@Injectable()
export class OnlineHouseService {
  constructor(
    private viewLogService: ViewLogService,
    private pointLogService: PointLogService,
    @InjectRepository(OnlineHouse)
    private onlineHouseRepository: Repository<OnlineHouse>,
    @InjectRepository(OnlineHouseImage)
    private onlineHouseImageRepository: Repository<OnlineHouseImage>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(OnlineHousePopularity)
    private onlineHousePopularityRepository: Repository<OnlineHousePopularity>,
    @InjectRepository(OnlineHouseLikeCount)
    private onlineHouseLikeCountRepository: Repository<OnlineHouseLikeCount>,
  ) {}
  async create(
    createOnlineHouseDto: CreateOnlineHouseDto,
    userId: number = undefined,
  ) {
    try {
      const newOnlineHouse = new OnlineHouse();
      if (createOnlineHouseDto.color_code !== undefined) {
        newOnlineHouse.color_info = new CommonConstant();
        newOnlineHouse.color_info.id = createOnlineHouseDto.color_code;
      }
      if (createOnlineHouseDto.family_type_code !== undefined) {
        newOnlineHouse.family_type_info = new CommonConstant();
        newOnlineHouse.family_type_info.id =
          createOnlineHouseDto.family_type_code;
      }
      if (createOnlineHouseDto.house_style_code !== undefined) {
        newOnlineHouse.house_style_info = new CommonConstant();
        newOnlineHouse.house_style_info.id =
          createOnlineHouseDto.house_style_code;
      }
      if (createOnlineHouseDto.house_type_code !== undefined) {
        newOnlineHouse.house_type_info = new CommonConstant();
        newOnlineHouse.house_type_info.id =
          createOnlineHouseDto.house_type_code;
      }
      if (createOnlineHouseDto.area_space_code !== undefined) {
        newOnlineHouse.area_space_info = new CommonConstant();
        newOnlineHouse.area_space_info.id =
          createOnlineHouseDto.area_space_code;
      }
      newOnlineHouse.reason = createOnlineHouseDto.reason;
      newOnlineHouse.main_display = createOnlineHouseDto.main_display;
      newOnlineHouse.view_point = createOnlineHouseDto.view_point;

      if (createOnlineHouseDto.tags) {
        newOnlineHouse.tags = [];
        for (const tag of createOnlineHouseDto.tags) {
          const tagEntity = new Tag();
          tagEntity.id = tag.id;
          newOnlineHouse.tags.push(tagEntity);
        }
      }
      if (createOnlineHouseDto.product_id !== undefined) {
        newOnlineHouse.product = new Product();
        newOnlineHouse.product.id = createOnlineHouseDto.product_id;
      }

      newOnlineHouse.onlineHouseImages = [];
      for (const onlineHouseImage of createOnlineHouseDto.onlineHouseImages) {
        const onlineHouseImageEntity = new OnlineHouseImage();
        onlineHouseImageEntity.image_url = onlineHouseImage.image_url;
        newOnlineHouse.onlineHouseImages.push(onlineHouseImageEntity);
      }
      if (createOnlineHouseDto.label_id !== undefined) {
        newOnlineHouse.label = new Label();
        newOnlineHouse.label.id = createOnlineHouseDto.label_id;
      }

      if (userId !== undefined) {
        newOnlineHouse.requester = new User();
        newOnlineHouse.requester.id = userId;
        newOnlineHouse.requested_at = new Date();
      }

      return await this.onlineHouseRepository.save(newOnlineHouse);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchOnlineHouseDto,
    userInfo: any = null,
  ): Promise<PageDto<OnlineHouse>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.onlineHouseRepository
        .createQueryBuilder('online_houses')
        .leftJoinAndSelect('online_houses.requester', 'requester')
        .leftJoinAndSelect('online_houses.product', 'product')
        .leftJoinAndSelect('online_houses.color_info', 'color_info')
        .leftJoinAndSelect('online_houses.family_type_info', 'family_type_info')
        .leftJoinAndSelect('online_houses.house_style_info', 'house_style_info')
        .leftJoinAndSelect('online_houses.house_type_info', 'house_type_info')
        .leftJoinAndSelect('online_houses.area_space_info', 'area_space_info')
        .leftJoinAndSelect('product.category_level1', 'category_level1')
        .leftJoinAndSelect('product.category_level2', 'category_level2')
        .leftJoinAndSelect('product.category_level3', 'category_level3')
        .leftJoinAndSelect(
          'product.house_style_info',
          'product_house_style_info',
        )
        .leftJoinAndSelect('product.color_info', 'product_color_info')
        .leftJoinAndSelect('online_houses.tags', 'tags')
        .leftJoinAndSelect(
          'online_houses.onlineHouseImages',
          'onlineHouseImages',
        )
        .select([
          'online_houses.id',
          'tags',
          'color_info',
          'family_type_info',
          'house_style_info',
          'house_type_info',
          'area_space_info',
          'onlineHouseImages',
          'online_houses.main_display',
          'online_houses.is_this_month',
          'online_houses.this_month_order',
          'online_houses.wish_count',
          'online_houses.like_count',
          'online_houses.view_count',
          'online_houses.status',
          'online_houses.created_at',
          'online_houses.updated_at',
          'online_houses.requested_at',
          'online_houses.rejected_at',
          'online_houses.approved_at',
          'requester.id',
          'requester.name',
          'requester.email',
          'requester.phone',
          'requester.account_type',
          'requester.contact_name',
          'requester.addr',
          'requester.addr_sub',
          'requester.zonecode',
          'requester.nickname',
          'requester.company_name',
          'product.title',
          'category_level1.id',
          'category_level1.name',
          'category_level2.id',
          'category_level2.name',
          'category_level3.name',
          'product_house_style_info',
          'product_color_info',
          'product.thumbnail_url',
        ]);

      if (pageOptionsDto.tags && pageOptionsDto.tags.length) {
        query = query.andWhere(`tags.id IN (:...tags)`, {
          tags: pageOptionsDto.tags,
        });
      }
      if (pageOptionsDto.color_list && pageOptionsDto.color_list.length) {
        query = query.andWhere(`color_info.id IN (:...color_list)`, {
          color_list: pageOptionsDto.color_list,
        });
      }
      if (
        pageOptionsDto.family_type_list &&
        pageOptionsDto.family_type_list.length
      ) {
        query = query.andWhere(
          `family_type_info.id IN (:...family_type_list)`,
          {
            family_type_list: pageOptionsDto.family_type_list,
          },
        );
      }

      if (pageOptionsDto.style_list && pageOptionsDto.style_list.length) {
        query = query.andWhere(`house_style_info.id IN (:...style_list)`, {
          style_list: pageOptionsDto.style_list,
        });
      }

      if (
        pageOptionsDto.area_space_list &&
        pageOptionsDto.area_space_list.length
      ) {
        query = query.andWhere(`area_space_info.id IN (:...areaSpaceList)`, {
          areaSpaceList: pageOptionsDto.area_space_list,
        });
      }
      if (
        pageOptionsDto.house_type_list &&
        pageOptionsDto.house_type_list.length
      ) {
        query = query.andWhere(`house_type_info.id IN (:...houseTypeList)`, {
          houseTypeList: pageOptionsDto.house_type_list,
        });
      }
      if (pageOptionsDto.status_list && pageOptionsDto.status_list.length) {
        query = query.andWhere(`online_houses.status IN (:...statusList)`, {
          statusList: pageOptionsDto.status_list,
        });
      }

      if (pageOptionsDto.category_level1_id !== undefined) {
        query = query.andWhere(`category_level1.id = :category_level1_id`, {
          category_level1_id: pageOptionsDto.category_level1_id,
        });
      }

      if (pageOptionsDto.category_level2_id !== undefined) {
        query = query.andWhere(`category_level2.id = :category_level2_id`, {
          category_level2_id: pageOptionsDto.category_level2_id,
        });
      }
      if (pageOptionsDto.requester_id !== undefined) {
        query = query.andWhere(`requester.id = :requester_id`, {
          requester_id: pageOptionsDto.requester_id,
        });
      }
      if (pageOptionsDto.status !== undefined) {
        query = query.andWhere(`online_houses.status = :status`, {
          status: pageOptionsDto.status,
        });
      }
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      const queryDateType = pageOptionsDto.date_type || 'requested_at';
      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `online_houses.${queryDateType} BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`online_houses.${queryDateType} >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`online_houses.${queryDateType} <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }
      if (pageOptionsDto.main_display !== undefined) {
        query = query.andWhere(`online_houses.main_display = :main_display`, {
          main_display: pageOptionsDto.main_display,
        });
      }
      if (pageOptionsDto.is_this_month !== undefined) {
        query = query.andWhere(`online_houses.is_this_month = :is_this_month`, {
          is_this_month: pageOptionsDto.is_this_month,
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(
          `online_houses.${orderBy}`,
          pageOptionsDto.order || Order.DESC,
        );

      const [entities, totalCount] = await query.getManyAndCount();
      if (
        entities.length &&
        userInfo &&
        userInfo.roles &&
        userInfo.roles.includes('user')
      ) {
        const userEntityLikes = await this.likeRepository
          .createQueryBuilder('like_items')
          .where('like_items.entity_id IN (:...ids)', {
            ids: entities.map((entity) => entity.id),
          })
          .andWhere(`like_items.user_id = :user_id`, {
            user_id: userInfo.id,
          })
          .andWhere(`like_items.type = :type`, {
            type: LikeEntityType.OnlineHouse,
          })
          .getMany();

        entities.forEach((entity) => {
          const userEntityLike = userEntityLikes.find(
            (like) => like.entity_id === entity.id,
          );
          entity.userLiked = userEntityLike ? true : false;
        });

        // wish status
        const userEntityWishes = await this.wishRepository
          .createQueryBuilder('wish_items')
          .where('wish_items.entity_id IN (:...ids)', {
            ids: entities.map((entity) => entity.id),
          })
          .andWhere(`wish_items.user_id = :user_id`, {
            user_id: userInfo.id,
          })
          .andWhere(`wish_items.type = :type`, {
            type: WishEntityType.OnlineHouse,
          })
          .getMany();

        entities.forEach((entity) => {
          const userEntityWish = userEntityWishes.find(
            (wish) => wish.entity_id === entity.id,
          );
          entity.userWished = userEntityWish ? true : false;
        });
      }

      let allCount = undefined;
      const whereGlobalCondition: any = {};
      if (pageOptionsDto.status !== undefined) {
        whereGlobalCondition.status = pageOptionsDto.status;
      }
      if (pageOptionsDto.needAllCount) {
        allCount = await this.onlineHouseRepository.count({
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

  async findOne(
    id: number,
    userInfo: any = null,
    canUpdateViewCount = false,
  ): Promise<any> {
    const onlineHouse = await this.onlineHouseRepository.findOne({
      where: { id: id },
      relations: {
        onlineHouseImages: true,
        tags: true,
        product: {
          category_level1: true,
          category_level2: true,
          category_level3: true,
          color_info: true,
          productImages: true,
          house_style_info: true,
          area_space_info: true,
        },
        label: true,
        color_info: true,
        onlineHousePopularity: true,
        onlineHouseLikeCount: true,
        family_type_info: true,
        house_style_info: true,
        house_type_info: true,
        area_space_info: true,
        requester: {
          profile: true,
        },
        statusAdmin: true,
      },
    });

    if (
      onlineHouse &&
      canUpdateViewCount &&
      ((userInfo && userInfo.roles && userInfo.roles.includes('user')) ||
        !userInfo)
    ) {
      await this.viewLogService.updateViewLog(userInfo?.id, {
        type: ViewLogEntityType.OnlineHouse,
        entity_id: id,
      });
      let onlineHousePopularity = onlineHouse.onlineHousePopularity;
      // update popularity
      if (onlineHousePopularity) {
        onlineHousePopularity.this_month_count =
          Number(onlineHouse.onlineHousePopularity.this_month_count) + 1;
      } else {
        onlineHousePopularity = new OnlineHousePopularity();
        onlineHousePopularity.onlineHouse = new OnlineHouse();
        onlineHousePopularity.onlineHouse.id = id;
        onlineHousePopularity.this_month_count = 1;
      }
      await this.onlineHousePopularityRepository.save(onlineHousePopularity);
      if (userInfo) {
        const userEntityLike = await this.likeRepository
          .createQueryBuilder('like_items')
          .where('like_items.entity_id = :entity_id', {
            entity_id: id,
          })
          .andWhere(`like_items.user_id = :user_id`, {
            user_id: userInfo.id,
          })
          .andWhere(`like_items.type = :type`, {
            type: LikeEntityType.OnlineHouse,
          })
          .getOne();
        onlineHouse.userLiked = userEntityLike ? true : false;

        const userEntityWish = await this.wishRepository
          .createQueryBuilder('wish_items')
          .where('wish_items.entity_id = :entity_id', {
            entity_id: id,
          })
          .andWhere(`wish_items.user_id = :user_id`, {
            user_id: userInfo.id,
          })
          .andWhere(`wish_items.type = :type`, {
            type: WishEntityType.OnlineHouse,
          })
          .getOne();
        onlineHouse.userWished = userEntityWish ? true : false;
      }
    }
    return onlineHouse;
  }

  async update(
    id: number,
    updateOnlineHouseDto: UpdateOnlineHouseDto,
    userId: number = undefined,
    isAdmin = false,
  ) {
    try {
      const onlineHouse = await this.findOne(id); // await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateOnlineHouseDto[field] !== undefined)
          onlineHouse[field] = updateOnlineHouseDto[field];
      };

      if (onlineHouse) {
        updateValue('reason');
        updateValue('main_display');
        updateValue('is_this_month');
        updateValue('view_point');
        if (updateOnlineHouseDto.tags) {
          onlineHouse.tags = [];

          for (const tag of updateOnlineHouseDto.tags) {
            const tagEntity = new Tag();
            tagEntity.id = tag.id;
            onlineHouse.tags.push(tagEntity);
          }
        }
        if (updateOnlineHouseDto.product_id !== undefined) {
          onlineHouse.product = new Product();
          onlineHouse.product.id = updateOnlineHouseDto.product_id;
        }
        if (updateOnlineHouseDto.color_code !== undefined) {
          onlineHouse.color_info = new CommonConstant();
          onlineHouse.color_info.id = updateOnlineHouseDto.color_code;
        }
        if (updateOnlineHouseDto.family_type_code !== undefined) {
          onlineHouse.family_type_info = new CommonConstant();
          onlineHouse.family_type_info.id =
            updateOnlineHouseDto.family_type_code;
        }
        if (updateOnlineHouseDto.house_style_code !== undefined) {
          onlineHouse.house_style_info = new CommonConstant();
          onlineHouse.house_style_info.id =
            updateOnlineHouseDto.house_style_code;
        }
        if (updateOnlineHouseDto.house_type_code !== undefined) {
          onlineHouse.house_type_info = new CommonConstant();
          onlineHouse.house_type_info.id = updateOnlineHouseDto.house_type_code;
        }
        if (updateOnlineHouseDto.area_space_code !== undefined) {
          onlineHouse.area_space_info = new CommonConstant();
          onlineHouse.area_space_info.id = updateOnlineHouseDto.area_space_code;
        }

        if (updateOnlineHouseDto.onlineHouseImages) {
          if (onlineHouse.onlineHouseImages) {
            // Find the images to remove
            const imagesToRemove = onlineHouse.onlineHouseImages.filter(
              (existingImage) => {
                return !updateOnlineHouseDto.onlineHouseImages.some(
                  (newImage) => newImage.id === existingImage.id,
                );
              },
            );

            // Delete the images that are no longer associated with the entity
            if (imagesToRemove.length) {
              await this.onlineHouseImageRepository.remove(imagesToRemove);
            }
          }
          onlineHouse.onlineHouseImages = [];
          for (const onlineHouseImage of updateOnlineHouseDto.onlineHouseImages) {
            const onlineHouseImageEntity = new OnlineHouseImage();
            if (onlineHouseImage.id) {
              onlineHouseImageEntity.id = onlineHouseImage.id;
            }
            onlineHouseImageEntity.image_url = onlineHouseImage.image_url;
            onlineHouse.onlineHouseImages.push(onlineHouseImageEntity);
          }
        }
        if (updateOnlineHouseDto.label_id !== undefined) {
          onlineHouse.label = new Label();
          onlineHouse.label.id = updateOnlineHouseDto.label_id;
        }

        if (
          isAdmin &&
          updateOnlineHouseDto.status !== undefined &&
          onlineHouse.status !== updateOnlineHouseDto.status
        ) {
          onlineHouse.status = updateOnlineHouseDto.status;
          if (updateOnlineHouseDto.status === GeneralProcessStatus.APPROVED) {
            onlineHouse.approved_at = new Date();
            onlineHouse.statusAdmin = new Admin();
            onlineHouse.statusAdmin.id = userId;

            if (onlineHouse.requester?.id) {
              await this.pointLogService.createWithType(
                {
                  user_id: onlineHouse.requester?.id,
                  point: 100,
                  memo: `랜선 집들이`,
                },
                PointType.OnlineHouse,
              );
            }
          } else if (
            updateOnlineHouseDto.status === GeneralProcessStatus.REJECTED
          ) {
            onlineHouse.rejected_at = new Date();
            onlineHouse.statusAdmin = new Admin();
            onlineHouse.statusAdmin.id = userId;
          }
        }

        if (!isAdmin && userId !== undefined) {
          onlineHouse.updated_by = userId;
        }
        return await this.onlineHouseRepository.save(onlineHouse);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: WishEntityType.OnlineHouse })
      .execute();

    await this.likeRepository
      .createQueryBuilder()
      .delete()
      .from(Like)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: LikeEntityType.OnlineHouse })
      .execute();
    return await this.onlineHouseRepository.delete(id);
  }

  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.onlineHouseRepository.update(id, { this_month_order: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetThisMonthPopularity(): Promise<void> {
    await this.onlineHousePopularityRepository
      .createQueryBuilder()
      .update(OnlineHousePopularity)
      .set({
        prev_month_count: () => 'this_month_count',
        this_month_count: 0,
        prev_month_rank: () => 'this_month_rank',
        this_month_rank: 0,
      })
      .execute();
  }

  async resetThisMonthLikeCount(): Promise<void> {
    await this.onlineHouseLikeCountRepository
      .createQueryBuilder()
      .update(OnlineHouseLikeCount)
      .set({
        prev_month_count: () => 'this_month_count',
        this_month_count: 0,
      })
      .execute();
  }

  async updatePopularPoint(): Promise<void> {
    // Update this_month_rank based on this_month_count ranking
    await this.onlineHousePopularityRepository.query(`
      UPDATE online_house_popularity
      JOIN (
        SELECT id, this_month_count,
              (
                SELECT COUNT(*) + 1
                FROM online_house_popularity AS pp2
                WHERE pp2.this_month_count > pp1.this_month_count
              ) AS this_month_rank
        FROM online_house_popularity AS pp1
      ) AS ranked
      ON online_house_popularity.id = ranked.id
      SET online_house_popularity.this_month_rank = ranked.this_month_rank;
    `);
    // Get all online_houses
    const onlineHouses = await this.onlineHouseRepository.find({
      relations: {
        onlineHousePopularity: true,
      },
      select: ['id', 'onlineHousePopularity', 'view_point'],
    });

    for (const onlineHouse of onlineHouses) {
      // Calculate popularity_point based on your formula
      let popularityPoint = onlineHouse.view_point;

      if (onlineHouse.onlineHousePopularity) {
        // If a record exists, update it
        popularityPoint =
          popularityPoint +
          (onlineHouse.onlineHousePopularity.this_month_rank
            ? onlineHouses.length -
              onlineHouse.onlineHousePopularity.this_month_rank
            : 0);
        onlineHouse.onlineHousePopularity.popularity_point = popularityPoint;
        await this.onlineHousePopularityRepository.save(
          onlineHouse.onlineHousePopularity,
        );
      } else {
        // If no record exists, create a new one
        const newPopularity = new OnlineHousePopularity();
        newPopularity.onlineHouse = new OnlineHouse();
        newPopularity.onlineHouse.id = onlineHouse.id;
        newPopularity.popularity_point = popularityPoint;
        await this.onlineHousePopularityRepository.save(newPopularity);
      }
    }
  }
}

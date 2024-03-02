import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, ILike } from 'typeorm';
import { CreateExpertHouseDto } from './dto/create-expert-house.dto';
import { UpdateExpertHouseDto } from './dto/update-expert-house.dto';
import { SearchExpertHouseDto } from './dto/search-expert-house.dto';
import { SearchHouseDto } from './dto/search-house.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { ExpertHouse } from './entities/expert-house.entity';
import { ExpertHousePopularity } from './entities/expert-house-popularity.entity';
import { ExpertHouseLikeCount } from './entities/expert-house-like-count.entity';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Label } from '../label/entities/label.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import {
  GeneralProcessStatus,
  Order,
  ViewLogEntityType,
} from '../../shared/constants';
import { CommonConstant } from '../common-constant/entities/common-constant.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Like } from './../like/entities/like.entity';
import { Wish } from '../wish/entities/wish.entity';
import { LikeEntityType, WishEntityType } from 'src/shared/constants';
import { ViewLogService } from '../view-log/view-log.service';
import { PointLogService } from '../point-log/point-log.service';
import { PointType } from '../../shared/constants';

@Injectable()
export class ExpertHouseService {
  constructor(
    private viewLogService: ViewLogService,
    private pointLogService: PointLogService,
    @InjectRepository(ExpertHouse)
    private expertHouseRepository: Repository<ExpertHouse>,
    @InjectRepository(OnlineHouse)
    private onlineHouseRepository: Repository<OnlineHouse>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(ExpertHousePopularity)
    private expertHousePopularityRepository: Repository<ExpertHousePopularity>,
    @InjectRepository(ExpertHouseLikeCount)
    private expertHouseLikeCountRepository: Repository<ExpertHouseLikeCount>,
  ) {}
  async create(
    createExpertHouseDto: CreateExpertHouseDto,
    userId: number = undefined,
  ) {
    try {
      const newExpertHouse = new ExpertHouse();
      if (createExpertHouseDto.color_code !== undefined) {
        newExpertHouse.color_info = new CommonConstant();
        newExpertHouse.color_info.id = createExpertHouseDto.color_code;
      }
      if (createExpertHouseDto.family_type_code !== undefined) {
        newExpertHouse.family_type_info = new CommonConstant();
        newExpertHouse.family_type_info.id =
          createExpertHouseDto.family_type_code;
      }
      if (createExpertHouseDto.house_style_code !== undefined) {
        newExpertHouse.house_style_info = new CommonConstant();
        newExpertHouse.house_style_info.id =
          createExpertHouseDto.house_style_code;
      }
      if (createExpertHouseDto.house_type_code !== undefined) {
        newExpertHouse.house_type_info = new CommonConstant();
        newExpertHouse.house_type_info.id =
          createExpertHouseDto.house_type_code;
      }
      if (createExpertHouseDto.area_space_code !== undefined) {
        newExpertHouse.area_space_info = new CommonConstant();
        newExpertHouse.area_space_info.id =
          createExpertHouseDto.area_space_code;
      }
      newExpertHouse.reason = createExpertHouseDto.reason;
      newExpertHouse.main_display = createExpertHouseDto.main_display;
      newExpertHouse.image_url = createExpertHouseDto.image_url;
      newExpertHouse.thumb_url = createExpertHouseDto.thumb_url;
      newExpertHouse.building_addr = createExpertHouseDto.building_addr;
      newExpertHouse.title = createExpertHouseDto.title;
      newExpertHouse.view_point = createExpertHouseDto.view_point;
      if (createExpertHouseDto.content) {
        const contentBuffer = Buffer.from(
          createExpertHouseDto.content,
          'utf-8',
        );
        newExpertHouse.content = contentBuffer;
      }

      if (createExpertHouseDto.tags) {
        newExpertHouse.tags = [];
        for (const tag of createExpertHouseDto.tags) {
          const tagEntity = new Tag();
          tagEntity.id = tag.id;
          newExpertHouse.tags.push(tagEntity);
        }
      }
      if (createExpertHouseDto.product_id !== undefined) {
        newExpertHouse.product = new Product();
        newExpertHouse.product.id = createExpertHouseDto.product_id;
      }

      if (createExpertHouseDto.label_id !== undefined) {
        newExpertHouse.label = new Label();
        newExpertHouse.label.id = createExpertHouseDto.label_id;
      }

      if (userId !== undefined) {
        newExpertHouse.requester = new User();
        newExpertHouse.requester.id = userId;
        newExpertHouse.requested_at = new Date();
      }

      return await this.expertHouseRepository.save(newExpertHouse);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchExpertHouseDto,
    userInfo: any = null,
  ): Promise<PageDto<ExpertHouse>> {
    try {
      const whereGlobalCondition: any = {};
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.expertHouseRepository
        .createQueryBuilder('expert_houses')
        .leftJoinAndSelect('expert_houses.requester', 'requester')
        .leftJoinAndSelect('expert_houses.product', 'product')
        .leftJoinAndSelect('expert_houses.color_info', 'color_info')
        .leftJoinAndSelect('expert_houses.family_type_info', 'family_type_info')
        .leftJoinAndSelect('expert_houses.house_style_info', 'house_style_info')
        .leftJoinAndSelect('expert_houses.house_type_info', 'house_type_info')
        .leftJoinAndSelect('expert_houses.area_space_info', 'area_space_info')
        .leftJoinAndSelect('product.category_level1', 'category_level1')
        .leftJoinAndSelect('product.category_level2', 'category_level2')
        .leftJoinAndSelect('product.category_level3', 'category_level3')
        .leftJoinAndSelect(
          'product.house_style_info',
          'product_house_style_info',
        )
        .leftJoinAndSelect('product.color_info', 'product_color_info')
        .leftJoinAndSelect('expert_houses.tags', 'tags')
        .select([
          'expert_houses.id',
          'expert_houses.image_url',
          'expert_houses.thumb_url',
          'expert_houses.building_addr',
          'expert_houses.title',
          'tags',
          'color_info',
          'family_type_info',
          'house_style_info',
          'house_type_info',
          'area_space_info',
          'expert_houses.main_display',
          'expert_houses.is_this_month',
          'expert_houses.this_month_order',
          'expert_houses.wish_count',
          'expert_houses.like_count',
          'expert_houses.view_count',
          'expert_houses.status',
          'expert_houses.created_at',
          'expert_houses.updated_at',
          'expert_houses.requested_at',
          'expert_houses.rejected_at',
          'expert_houses.approved_at',
          'requester.id',
          'requester.name',
          'requester.email',
          'requester.phone',
          'requester.account_type',
          'requester.contact_name',
          'requester.addr',
          'requester.addr_sub',
          'requester.zonecode',
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
        query = query.andWhere(`area_space_info.id IN (:...area_space_list)`, {
          area_space_list: pageOptionsDto.area_space_list,
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
        query = query.andWhere(`expert_houses.status IN (:...statusList)`, {
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
        query = query.andWhere(`expert_houses.status = :status`, {
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
          `expert_houses.${queryDateType} BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`expert_houses.${queryDateType} >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`expert_houses.${queryDateType} <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }
      if (pageOptionsDto.main_display !== undefined) {
        query = query.andWhere(`expert_houses.main_display = :main_display`, {
          main_display: pageOptionsDto.main_display,
        });
      }
      if (pageOptionsDto.is_this_month !== undefined) {
        query = query.andWhere(`expert_houses.is_this_month = :is_this_month`, {
          is_this_month: pageOptionsDto.is_this_month,
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(
          `expert_houses.${orderBy}`,
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
            type: LikeEntityType.ExpertHouse,
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
            type: WishEntityType.ExpertHouse,
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

      if (pageOptionsDto.status !== undefined) {
        whereGlobalCondition.status = pageOptionsDto.status;
      }
      if (pageOptionsDto.needAllCount) {
        allCount = await this.expertHouseRepository.count({
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

  async getHouseListTotalCount(
    pageOptionsDto: SearchHouseDto,
  ): Promise<number> {
    try {
      const whereCondition: any = {};
      const statusList = pageOptionsDto.status_list;
      const entityTypeList =
        pageOptionsDto.entity_type_list &&
        pageOptionsDto.entity_type_list.length
          ? pageOptionsDto.entity_type_list
          : ['online', 'expert'];
      if (statusList && statusList.length > 0) {
        whereCondition.status = In(statusList);
      }
      if (pageOptionsDto.requester_id !== undefined) {
        whereCondition.requester = {
          id: pageOptionsDto.requester_id,
        };
      }
      if (pageOptionsDto.product_id !== undefined) {
        whereCondition.product = {
          id: pageOptionsDto.product_id,
        };
      }
      if (pageOptionsDto.exclude_requester_id !== undefined) {
        whereCondition.requester = {
          id: Not(pageOptionsDto.exclude_requester_id),
        };
      }
      if (pageOptionsDto.category_level1_id !== undefined) {
        whereCondition.product = {
          category_level1: {
            id: pageOptionsDto.category_level1_id,
          },
        };
      }
      if (pageOptionsDto.category_level2_id !== undefined) {
        whereCondition.product = {
          category_level2: {
            id: pageOptionsDto.category_level2_id,
          },
        };
      }

      if (pageOptionsDto.is_this_month !== undefined) {
        whereCondition.is_this_month = pageOptionsDto.is_this_month;
      }
      if (pageOptionsDto.tags && pageOptionsDto.tags.length) {
        whereCondition.tags = {
          id: In(pageOptionsDto.tags),
        };
      }
      if (pageOptionsDto.color_list && pageOptionsDto.color_list.length) {
        whereCondition.color_info = {
          id: In(pageOptionsDto.color_list),
        };
      }
      if (
        pageOptionsDto.family_type_list &&
        pageOptionsDto.family_type_list.length
      ) {
        whereCondition.family_type_info = {
          id: In(pageOptionsDto.family_type_list),
        };
      }
      if (pageOptionsDto.style_list && pageOptionsDto.style_list.length) {
        whereCondition.house_style_info = {
          id: In(pageOptionsDto.style_list),
        };
      }
      if (
        pageOptionsDto.area_space_list &&
        pageOptionsDto.area_space_list.length
      ) {
        whereCondition.area_space_info = {
          id: In(pageOptionsDto.area_space_list),
        };
      }
      if (
        pageOptionsDto.house_type_list &&
        pageOptionsDto.house_type_list.length
      ) {
        whereCondition.house_type_info = {
          id: In(pageOptionsDto.house_type_list),
        };
      }
      let allCount = 0;

      if (entityTypeList.includes('online')) {
        const ohWhere = { ...whereCondition };
        if (pageOptionsDto.q) {
          ohWhere.product = { title: ILike(`%${pageOptionsDto.q}%`) };
        }

        if (pageOptionsDto.exclude_house_id !== undefined) {
          const excludeType = pageOptionsDto.exclude_house_type || 'expert';
          if (excludeType === 'online') {
            ohWhere.id = Not(pageOptionsDto.exclude_house_id);
          }
        }
        allCount = await this.onlineHouseRepository.count({
          where: ohWhere,
          relations: {
            requester: true,
            product: {
              category_level1: true,
              category_level2: true,
              color_info: true,
              family_type_info: true,
              house_style_info: true,
              house_type_info: true,
              area_space_info: true,
              tags: true,
            },
          },
        });
      }
      if (entityTypeList.includes('expert')) {
        if (pageOptionsDto.q) {
          whereCondition.title = ILike(`%${pageOptionsDto.q}%`);
        }

        if (pageOptionsDto.exclude_house_id !== undefined) {
          const excludeType = pageOptionsDto.exclude_house_type || 'expert';
          if (excludeType === 'expert') {
            whereCondition.id = Not(pageOptionsDto.exclude_house_id);
          }
        }
        const expertCount = await this.expertHouseRepository.count({
          where: whereCondition,
          relations: {
            requester: true,
            product: {
              category_level1: true,
              category_level2: true,
              color_info: true,
              family_type_info: true,
              house_style_info: true,
              house_type_info: true,
              area_space_info: true,
              tags: true,
            },
          },
        });

        allCount = allCount + expertCount;
      }
      return allCount;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  private async getTotalCount(sqlQuery: string): Promise<number> {
    const totalCountQuery = `
    SELECT COUNT(*) AS total_count
    FROM (${sqlQuery}) A
    `;

    const totalCountQueryResult = await this.expertHouseRepository.query(
      totalCountQuery,
    );
    // console.log('totalCountQueryResult', totalCountQueryResult);
    let totalCount = 0;
    if (totalCountQueryResult.length) {
      totalCount = Number(totalCountQueryResult[0].total_count);
    }
    return totalCount;
  }

  async getHouseList(
    pageOptionsDto: SearchHouseDto,
    userInfo: any = null,
  ): Promise<PageDto<ExpertHouse | OnlineHouse>> {
    const whereGlobalCondition: any = {};
    const whereQueryListEh = [];
    const whereQueryListOh = [];
    const orderBy = pageOptionsDto.sortBy || 'id';

    if (pageOptionsDto.q !== undefined) {
      whereQueryListEh.push(
        `LOWER(eh.title LIKE LOWER('%${pageOptionsDto.q}%')`,
      );
      whereQueryListOh.push(
        `LOWER(p.title) LIKE LOWER('%${pageOptionsDto.q}%')`,
      );
    }

    if (pageOptionsDto.product_id !== undefined) {
      whereQueryListEh.push(`eh.product_id = ${pageOptionsDto.product_id}`);
      whereQueryListOh.push(`oh.product_id = ${pageOptionsDto.product_id}`);
    }

    if (pageOptionsDto.is_this_month !== undefined) {
      whereQueryListEh.push(
        `eh.is_this_month = ${pageOptionsDto.is_this_month ? 1 : 0}`,
      );
      whereQueryListOh.push(
        `oh.is_this_month = ${pageOptionsDto.is_this_month ? 1 : 0}`,
      );
    }
    try {
      let allCount = undefined;
      const statusList =
        pageOptionsDto.status_list && pageOptionsDto.status_list.length
          ? pageOptionsDto.status_list
          : [0, 1, 2];
      const entityTypeList = pageOptionsDto.entity_type_list || [];

      const requesterFilter =
        pageOptionsDto.requester_id !== undefined
          ? `AND u.id = ${pageOptionsDto.requester_id}`
          : '';
      const queryExpert = `
      (
        SELECT 'expert' as entity_type, eh.id, eh.title, eh.thumb_url, null as images, eh.status,
          eh.requested_at, eh.approved_at, eh.rejected_at, p.title as product_name, 
          u.name as requester_name, u.nickname as requester_nick_name, u.company_name as requester_company_name, eh.updated_at
        FROM expert_houses eh
        LEFT JOIN products p ON p.id = eh.product_id
        LEFT JOIN users u ON u.id = eh.requested_by
        WHERE eh.status IN (${statusList
          .map((status) => `'${status}'`)
          .join(',')})
          ${requesterFilter}
          ${
            whereQueryListEh.length
              ? ' AND ' + whereQueryListEh.join(' AND ')
              : ''
          }
      )`;

      const queryOnline = `
      (
        SELECT 'online' as entity_type, oh.id,  '' as title, null as thumb_url,
        COALESCE(JSON_ARRAYAGG(ohi.image_url), JSON_ARRAY()) AS images, oh.status,
        oh.requested_at, oh.approved_at, oh.rejected_at, p.title as product_name, 
        u.name as requester_name, u.nickname as requester_nick_name, u.company_name as requester_company_name, oh.updated_at FROM online_houses oh
        LEFT JOIN products p ON p.id = oh.product_id
        LEFT JOIN online_house_images ohi ON ohi.online_house_id = oh.id
        LEFT JOIN users u ON u.id = oh.requested_by
        WHERE oh.status IN (${statusList
          .map((status) => `'${status}'`)
          .join(',')})
          ${requesterFilter}
          ${
            whereQueryListOh.length
              ? ' AND ' + whereQueryListOh.join(' AND ')
              : ''
          }
        GROUP BY
          oh.id
      )`;

      const queryPage = pageOptionsDto.take
        ? `
        ORDER BY ${orderBy} ${pageOptionsDto.order}
        LIMIT ${pageOptionsDto.take}
        OFFSET ${pageOptionsDto.skip};
      `
        : `
      ORDER BY ${orderBy} ${pageOptionsDto.order}
    `;
      let query = `
        ${queryOnline}
        UNION
        ${queryExpert}
        ${queryPage}
      `;

      let result = [];

      let totalCount = 0;
      if (entityTypeList.length == 2 || entityTypeList.length == 0) {
        query = `
        ${queryOnline}
        UNION
        ${queryExpert}
        ${queryPage}
      `;
      } else if (
        entityTypeList.length == 1 &&
        entityTypeList.includes('online')
      ) {
        query = `
        ${queryOnline}
        ${queryPage}
        `;
      } else if (
        entityTypeList.length == 1 &&
        entityTypeList.includes('expert')
      ) {
        query = `
        ${queryExpert}
        ${queryPage}
        `;
      }

      result = await this.expertHouseRepository.query(query);
      if (pageOptionsDto.requester_id !== undefined) {
        whereGlobalCondition.requester = { id: pageOptionsDto.requester_id };
      }
      if (pageOptionsDto.needAllCount) {
        allCount = await this.expertHouseRepository.count({
          where: whereGlobalCondition,
          relations: {
            requester: true,
          },
        });

        const onlineCount = await this.onlineHouseRepository.count({
          where: whereGlobalCondition,
          relations: {
            requester: true,
          },
        });
        allCount = onlineCount + allCount;
      }

      totalCount = await this.getHouseListTotalCount(pageOptionsDto);
      const pageMetaDto = new PageMetaDto({
        totalCount,
        pageOptionsDto,
        allCount,
      });

      return new PageDto(
        result.reduce((newArray, row) => {
          const entity = row;
          if (entity.images) {
            entity.images = JSON.parse(entity.images);
          }
          if (entity.id) {
            newArray.push(entity);
          }
          return newArray;
        }, []),
        pageMetaDto,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getHouseListForUser(
    pageOptionsDto: SearchHouseDto,
    userInfo: any = null,
  ): Promise<PageDto<ExpertHouse | OnlineHouse>> {
    const whereGlobalCondition: any = {};
    const whereQueryListEh = [];
    const whereQueryListOh = [];
    const orderBy = pageOptionsDto.sortBy || 'id';

    if (pageOptionsDto.q !== undefined) {
      whereQueryListEh.push(
        `LOWER(eh.title) LIKE LOWER('%${pageOptionsDto.q}%') OR LOWER(ts.name) LIKE LOWER('%${pageOptionsDto.q}%')`,
      );
      whereQueryListOh.push(
        `LOWER(p.title) LIKE LOWER('%${pageOptionsDto.q}%') OR LOWER(ts.name) LIKE LOWER('%${pageOptionsDto.q}%')`,
      );
    }
    if (pageOptionsDto.exclude_house_id !== undefined) {
      const excludeType = pageOptionsDto.exclude_house_type || 'expert';
      if (excludeType === 'expert') {
        whereQueryListEh.push(`eh.id != ${pageOptionsDto.exclude_house_id}`);
      } else {
        whereQueryListOh.push(`oh.id != ${pageOptionsDto.exclude_house_id}`);
      }
    }
    if (pageOptionsDto.tags && pageOptionsDto.tags.length) {
      whereQueryListEh.push(
        `ts.id IN (${pageOptionsDto.tags.map((tag) => `'${tag}'`).join(',')})`,
      );
      whereQueryListOh.push(
        `ts.id IN (${pageOptionsDto.tags.map((tag) => `'${tag}'`).join(',')})`,
      );
    }
    if (pageOptionsDto.product_id !== undefined) {
      whereQueryListEh.push(`eh.product_id = ${pageOptionsDto.product_id}`);
      whereQueryListOh.push(`oh.product_id = ${pageOptionsDto.product_id}`);
    }
    if (pageOptionsDto.entity_id !== undefined) {
      whereQueryListEh.push(`eh.id = ${pageOptionsDto.entity_id}`);
      whereQueryListOh.push(`oh.id = ${pageOptionsDto.entity_id}`);
    }
    if (pageOptionsDto.is_this_month !== undefined) {
      whereQueryListEh.push(
        `eh.is_this_month = ${pageOptionsDto.is_this_month ? 1 : 0}`,
      );
      whereQueryListOh.push(
        `oh.is_this_month = ${pageOptionsDto.is_this_month ? 1 : 0}`,
      );
    }

    if (pageOptionsDto.color_list && pageOptionsDto.color_list.length) {
      whereQueryListEh.push(
        `eh.color_code IN (${pageOptionsDto.color_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
      whereQueryListOh.push(
        `oh.color_code IN (${pageOptionsDto.color_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
    }
    if (
      pageOptionsDto.family_type_list &&
      pageOptionsDto.family_type_list.length
    ) {
      whereQueryListEh.push(
        `eh.family_type_code IN (${pageOptionsDto.family_type_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
      whereQueryListOh.push(
        `oh.family_type_code IN (${pageOptionsDto.family_type_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
    }
    if (pageOptionsDto.style_list && pageOptionsDto.style_list.length) {
      whereQueryListEh.push(
        `eh.house_style_code IN (${pageOptionsDto.style_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
      whereQueryListOh.push(
        `oh.house_style_code IN (${pageOptionsDto.style_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
    }
    if (
      pageOptionsDto.area_space_list &&
      pageOptionsDto.area_space_list.length
    ) {
      whereQueryListEh.push(
        `eh.area_space_code IN (${pageOptionsDto.area_space_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
      whereQueryListOh.push(
        `oh.area_space_code IN (${pageOptionsDto.area_space_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
    }
    if (
      pageOptionsDto.house_type_list &&
      pageOptionsDto.house_type_list.length
    ) {
      whereQueryListEh.push(
        `eh.house_type_code IN (${pageOptionsDto.house_type_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
      whereQueryListOh.push(
        `oh.house_type_code IN (${pageOptionsDto.house_type_list
          .map((code) => `'${code}'`)
          .join(',')})`,
      );
    }
    // if (pageOptionsDto.tags && pageOptionsDto.tags.length) {
    //   whereQueryListEh.push(
    //     `ts.id IN (${pageOptionsDto.tags
    //       .map((code) => `'${code}'`)
    //       .join(',')})`,
    //   );
    //   whereQueryListOh.push(
    //     `ts.id IN (${pageOptionsDto.tags
    //       .map((code) => `'${code}'`)
    //       .join(',')})`,
    //   );
    // }
    try {
      let allCount = undefined;
      const statusList =
        pageOptionsDto.status_list && pageOptionsDto.status_list.length
          ? pageOptionsDto.status_list
          : [0, 1, 2];
      const entityTypeList = pageOptionsDto.entity_type_list || [];

      const requesterFilter =
        pageOptionsDto.requester_id !== undefined
          ? `AND u.id = ${pageOptionsDto.requester_id}`
          : '';
      const excludeRequesterFilter =
        pageOptionsDto.exclude_requester_id !== undefined
          ? `AND u.id != ${pageOptionsDto.exclude_requester_id}`
          : '';
      const cat1Filter =
        pageOptionsDto.category_level1_id !== undefined
          ? `AND cat1.id = ${pageOptionsDto.category_level1_id}`
          : '';
      const cat2Filter =
        pageOptionsDto.category_level2_id !== undefined
          ? `AND cat2.id = ${pageOptionsDto.category_level2_id}`
          : '';

      const queryExpert = `
      (
        SELECT 'expert' as entity_type, eh.id, eh.title, eh.thumb_url, null as images, eh.status,
          (
            SELECT COALESCE(
              JSON_ARRAYAGG(ts.name), JSON_ARRAY())
            FROM expert_house_tags ht
            LEFT JOIN tags ts ON ht.tag_id = ts.id
            WHERE ht.expert_house_id = p.id
          )
          AS tags,
          eh.requested_at, eh.approved_at, eh.rejected_at, p.title as product_name, 
          u.name as requester_name, u.nickname as requester_nick_name, u.company_name as requester_company_name,
          pr.photo as requester_photo, eh.updated_at, eh.is_this_month, popular.popularity_point as popularity,
          popular.this_month_count as this_month_count,
          ehlk.this_month_count as this_month_like_count, ehlk.prev_month_count as prev_month_like_count,
          eh.reason,
          CASE
            WHEN c_color.id IS NOT NULL THEN 
              JSON_OBJECT(
                'id', c_color.id,
                'name', c_color.name,
                'type', c_color.type
              )
            ELSE NULL
          END AS color_info,
          CASE
            WHEN c_family_type.id IS NOT NULL THEN 
              JSON_OBJECT(
                'id', c_family_type.id,
                'name', c_family_type.name,
                'type', c_family_type.type
              )
            ELSE NULL
          END AS family_type_info,
          CASE
            WHEN c_house_style.id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', c_house_style.id,
              'name', c_house_style.name,
              'type', c_house_style.type
            )
            ELSE NULL
          END AS house_style_info,
          CASE
            WHEN c_house_type.id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', c_house_type.id,
              'name', c_house_type.name,
              'type', c_house_type.type
            )
            ELSE NULL
          END AS house_type_info,
          CASE
            WHEN c_area_space.id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', c_area_space.id,
              'name', c_area_space.name,
              'type', c_area_space.type
            )
            ELSE NULL
          END AS area_space_info,
          CASE
            WHEN cat1.id IS NOT NULL THEN 
              JSON_OBJECT(
                'id', cat1.id,
                'name', cat1.name
              )
            ELSE NULL
          END AS category_level1,
          CASE
            WHEN cat2.id IS NOT NULL THEN 
              JSON_OBJECT(
                'id', cat2.id,
                'name', cat2.name
              )
            ELSE NULL
          END AS category_level2,
          (w.id IS NOT NULL) AS wished, (lk.id IS NOT NULL) AS liked
        FROM expert_houses eh
        LEFT JOIN products p ON p.id = eh.product_id
        LEFT JOIN users u ON u.id = eh.requested_by
        LEFT JOIN expert_house_tags eht ON eht.expert_house_id = eh.id
        LEFT JOIN tags ts ON eht.tag_id = ts.id
        LEFT JOIN profiles pr ON pr.user_id = u.id
        LEFT JOIN common_constants c_color ON c_color.id = eh.color_code
        LEFT JOIN common_constants c_family_type ON c_family_type.id = eh.family_type_code
        LEFT JOIN common_constants c_house_style ON c_house_style.id = eh.house_style_code
        LEFT JOIN common_constants c_house_type ON c_house_type.id = eh.house_type_code
        LEFT JOIN common_constants c_area_space ON c_area_space.id = eh.area_space_code
        LEFT JOIN categories_tree cat1 ON cat1.id = p.category_level1_id
        LEFT JOIN categories_tree cat2 ON cat2.id = p.category_level2_id
        LEFT JOIN expert_house_popularity popular ON eh.id = popular.entity_id
        LEFT JOIN expert_house_like_count ehlk ON eh.id = ehlk.entity_id
        LEFT JOIN wish_items w on w.entity_id=eh.id AND w.user_id = '${
          userInfo?.id || -1
        }' AND w.type='expert_house'
        LEFT JOIN like_items lk on lk.entity_id=eh.id AND lk.user_id = '${
          userInfo?.id || -1
        }' AND lk.type='expert_house'
        WHERE eh.status IN (${statusList
          .map((status) => `'${status}'`)
          .join(',')})
          ${requesterFilter}
          ${excludeRequesterFilter}
          ${cat1Filter}
          ${cat2Filter}
          ${
            whereQueryListEh.length
              ? ' AND ' + whereQueryListEh.join(' AND ')
              : ''
          }
        GROUP BY
          eh.id
      )`;

      const queryOnline = `
      (
        SELECT 'online' as entity_type, oh.id,  '' as title, null as thumb_url,
        (
          SELECT COALESCE(JSON_ARRAYAGG(ohi.image_url), JSON_ARRAY())
          FROM online_house_images ohi WHERE ohi.online_house_id = oh.id
        ) AS images, oh.status,
        (
          SELECT COALESCE(JSON_ARRAYAGG(ts.name), JSON_ARRAY())
          FROM online_house_tags ht
          LEFT JOIN tags ts ON ht.tag_id = ts.id
          WHERE ht.online_house_id = oh.id
        )
        AS tags,
        oh.requested_at, oh.approved_at, oh.rejected_at, p.title as product_name, 
        u.name as requester_name, u.nickname as requester_nick_name, u.company_name as requester_company_name,
        pr.photo as requester_photo, oh.updated_at, oh.is_this_month, popular.popularity_point as popularity,
        popular.this_month_count as this_month_count,
        ohlk.this_month_count as this_month_like_count, ohlk.prev_month_count as prev_month_like_count,
        oh.reason,
        CASE
          WHEN c_color.id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', c_color.id,
              'name', c_color.name,
              'type', c_color.type
            )
          ELSE NULL
        END AS color_info,
        CASE
          WHEN c_family_type.id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', c_family_type.id,
              'name', c_family_type.name,
              'type', c_family_type.type
            )
          ELSE NULL
        END AS family_type_info,
        CASE
          WHEN c_house_style.id IS NOT NULL THEN 
          JSON_OBJECT(
            'id', c_house_style.id,
            'name', c_house_style.name,
            'type', c_house_style.type
          )
          ELSE NULL
        END AS house_style_info,
        CASE
          WHEN c_house_type.id IS NOT NULL THEN 
          JSON_OBJECT(
            'id', c_house_type.id,
            'name', c_house_type.name,
            'type', c_house_type.type
          )
          ELSE NULL
        END AS house_type_info,
        CASE
          WHEN c_area_space.id IS NOT NULL THEN 
          JSON_OBJECT(
            'id', c_area_space.id,
            'name', c_area_space.name,
            'type', c_area_space.type
          )
          ELSE NULL
        END AS area_space_info,
        CASE
          WHEN cat1.id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', cat1.id,
              'name', cat1.name
            )
          ELSE NULL
        END AS category_level1,
        CASE
          WHEN cat2.id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', cat2.id,
              'name', cat2.name
            )
          ELSE NULL
        END AS category_level2,
        (w.id IS NOT NULL) AS wished, (lk.id IS NOT NULL) AS liked
        FROM online_houses oh
        LEFT JOIN products p ON p.id = oh.product_id
        LEFT JOIN users u ON u.id = oh.requested_by
        LEFT JOIN profiles pr ON pr.user_id = u.id
        LEFT JOIN common_constants c_color ON c_color.id = oh.color_code
        LEFT JOIN common_constants c_family_type ON c_family_type.id = oh.family_type_code
        LEFT JOIN common_constants c_house_style ON c_house_style.id = oh.house_style_code
        LEFT JOIN common_constants c_house_type ON c_house_type.id = oh.house_type_code
        LEFT JOIN common_constants c_area_space ON c_area_space.id = oh.area_space_code
        LEFT JOIN categories_tree cat1 ON cat1.id = p.category_level1_id
        LEFT JOIN categories_tree cat2 ON cat2.id = p.category_level2_id
        LEFT JOIN online_house_tags oht ON oht.online_house_id = oh.id
        LEFT JOIN tags ts ON oht.tag_id = ts.id
        LEFT JOIN online_house_popularity popular ON oh.id = popular.entity_id
        LEFT JOIN online_house_like_count ohlk ON oh.id = ohlk.entity_id
        LEFT JOIN wish_items w on w.entity_id=oh.id AND w.user_id = '${
          userInfo?.id || -1
        }' AND w.type='online_house'
        LEFT JOIN like_items lk on lk.entity_id=oh.id AND lk.user_id = '${
          userInfo?.id || -1
        }' AND lk.type='online_house'
        WHERE oh.status IN (${statusList
          .map((status) => `'${status}'`)
          .join(',')})
          ${requesterFilter}
          ${excludeRequesterFilter}
          ${cat1Filter}
          ${cat2Filter}
          ${
            whereQueryListOh.length
              ? ' AND ' + whereQueryListOh.join(' AND ')
              : ''
          }
        GROUP BY
          oh.id
      )`;

      const orderByPart =
        pageOptionsDto.random === true
          ? 'RAND()'
          : `${orderBy} ${pageOptionsDto.order}`;

      const queryPage = pageOptionsDto.take
        ? `
        ORDER BY ${orderByPart}
        LIMIT ${pageOptionsDto.take}
        OFFSET ${pageOptionsDto.skip};
      `
        : `
      ORDER BY ${orderByPart}
    `;
      const query = `
        ${queryOnline}
        UNION
        ${queryExpert}
        ${queryPage}
      `;

      let result = [];
      let totalCount = 0;
      if (entityTypeList.length == 2 || entityTypeList.length == 0) {
        result = await this.expertHouseRepository.query(query);
        totalCount = await this.getTotalCount(`
          ${queryOnline}
          UNION
          ${queryExpert}
        `);
      } else if (
        entityTypeList.length == 1 &&
        entityTypeList.includes('online')
      ) {
        result = await this.expertHouseRepository.query(
          queryOnline + ` ${queryPage}`,
        );
        totalCount = await this.getTotalCount(queryOnline);
      } else if (
        entityTypeList.length == 1 &&
        entityTypeList.includes('expert')
      ) {
        result = await this.expertHouseRepository.query(
          queryExpert + ` ${queryPage}`,
        );
        totalCount = await this.getTotalCount(queryExpert);
      }
      if (pageOptionsDto.requester_id !== undefined) {
        whereGlobalCondition.requester = { id: pageOptionsDto.requester_id };
      }
      if (pageOptionsDto.needAllCount) {
        if (entityTypeList.length === 0 || entityTypeList.includes('expert')) {
          allCount = await this.expertHouseRepository.count({
            where: whereGlobalCondition,
            relations: {
              requester: true,
            },
          });
        }

        if (entityTypeList.length === 0 || entityTypeList.includes('online')) {
          const onlineCount = await this.onlineHouseRepository.count({
            where: whereGlobalCondition,
            relations: {
              requester: true,
            },
          });
          allCount = onlineCount + (allCount || 0);
        }
      }

      // const totalCount =
      //   pageOptionsDto.entity_id !== undefined
      //     ? result.length
      //     : await this.getHouseListTotalCount(pageOptionsDto);
      const pageMetaDto = new PageMetaDto({
        totalCount,
        pageOptionsDto,
        allCount,
      });

      return new PageDto(
        result.reduce((newArray, row) => {
          const entity = row;
          if (entity.tags) {
            entity.tags = JSON.parse(entity.tags);
          }
          if (entity.color_info) {
            entity.color_info = JSON.parse(entity.color_info);
          }
          if (entity.family_type_info) {
            entity.family_type_info = JSON.parse(entity.family_type_info);
          }
          if (entity.house_style_info) {
            entity.house_style_info = JSON.parse(entity.house_style_info);
          }
          if (entity.house_type_info) {
            entity.house_type_info = JSON.parse(entity.house_type_info);
          }
          if (entity.area_space_info) {
            entity.area_space_info = JSON.parse(entity.area_space_info);
          }
          if (entity.category_level1) {
            entity.category_level1 = JSON.parse(entity.category_level1);
          }
          if (entity.category_level2) {
            entity.category_level2 = JSON.parse(entity.category_level2);
          }
          if (entity.images) {
            entity.images = JSON.parse(entity.images);
          }
          if (entity.id) {
            newArray.push(entity);
          }
          return newArray;
        }, []),
        pageMetaDto,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(
    id: number,
    userInfo: any = null,
    canUpdateViewCount = false,
    needConvert = false,
  ): Promise<any> {
    const expertHouse = await this.expertHouseRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'image_url',
        'thumb_url',
        'building_addr',
        'title',
        'main_display',
        'is_this_month',
        'this_month_order',
        'wish_count',
        'like_count',
        'view_count',
        'status',
        'updated_at',
        'requested_at',
        'rejected_at',
        'approved_at',
      ],
      relations: {
        tags: true,
        expertHousePopularity: true,
        expertHouseLikeCount: true,
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
    if (expertHouse) {
      const expertHouseEntity = await this.expertHouseRepository.findOne({
        where: { id: id },
        select: ['content'],
      });
      expertHouse.content = expertHouseEntity.content;
    }
    if (
      expertHouse &&
      canUpdateViewCount &&
      ((userInfo && userInfo.roles && userInfo.roles.includes('user')) ||
        !userInfo)
    ) {
      await this.viewLogService.updateViewLog(userInfo?.id, {
        type: ViewLogEntityType.ExpertHouse,
        entity_id: id,
      });
      let expertHousePopularity = expertHouse.expertHousePopularity;
      // update popularity
      if (expertHousePopularity) {
        expertHousePopularity.this_month_count =
          Number(expertHouse.expertHousePopularity.this_month_count) + 1;
      } else {
        expertHousePopularity = new ExpertHousePopularity();
        expertHousePopularity.expertHouse = new ExpertHouse();
        expertHousePopularity.expertHouse.id = id;
        expertHousePopularity.this_month_count = 1;
      }
      await this.expertHousePopularityRepository.save(expertHousePopularity);
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
            type: LikeEntityType.ExpertHouse,
          })
          .getOne();
        expertHouse.userLiked = userEntityLike ? true : false;

        const userEntityWish = await this.wishRepository
          .createQueryBuilder('wish_items')
          .where('wish_items.entity_id = :entity_id', {
            entity_id: id,
          })
          .andWhere(`wish_items.user_id = :user_id`, {
            user_id: userInfo.id,
          })
          .andWhere(`wish_items.type = :type`, {
            type: WishEntityType.ExpertHouse,
          })
          .getOne();
        expertHouse.userWished = userEntityWish ? true : false;
      }
    }
    if (needConvert && expertHouse && expertHouse.content) {
      const contentString = expertHouse.content?.toString('utf-8');
      return { ...expertHouse, content: contentString };
    }
    return expertHouse;
  }

  async update(
    id: number,
    updateExpertHouseDto: UpdateExpertHouseDto,
    userId: number = undefined,
    isAdmin = false,
  ) {
    try {
      const expertHouse = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateExpertHouseDto[field] !== undefined)
          expertHouse[field] = updateExpertHouseDto[field];
      };

      if (expertHouse) {
        updateValue('reason');
        updateValue('main_display');
        updateValue('image_url');
        updateValue('thumb_url');
        updateValue('building_addr');
        updateValue('title');
        // updateValue('content');
        updateValue('is_this_month');
        updateValue('view_point');
        if (updateExpertHouseDto.content) {
          const contentBuffer = Buffer.from(
            updateExpertHouseDto.content,
            'utf-8',
          );
          expertHouse.content = contentBuffer;
        }
        if (updateExpertHouseDto.tags) {
          expertHouse.tags = [];

          for (const tag of updateExpertHouseDto.tags) {
            const tagEntity = new Tag();
            tagEntity.id = tag.id;
            expertHouse.tags.push(tagEntity);
          }
        }
        if (updateExpertHouseDto.product_id !== undefined) {
          expertHouse.product = new Product();
          expertHouse.product.id = updateExpertHouseDto.product_id;
        }
        if (updateExpertHouseDto.color_code !== undefined) {
          expertHouse.color_info = new CommonConstant();
          expertHouse.color_info.id = updateExpertHouseDto.color_code;
        }
        if (updateExpertHouseDto.family_type_code !== undefined) {
          expertHouse.family_type_info = new CommonConstant();
          expertHouse.family_type_info.id =
            updateExpertHouseDto.family_type_code;
        }
        if (updateExpertHouseDto.house_style_code !== undefined) {
          expertHouse.house_style_info = new CommonConstant();
          expertHouse.house_style_info.id =
            updateExpertHouseDto.house_style_code;
        }
        if (updateExpertHouseDto.house_type_code !== undefined) {
          expertHouse.house_type_info = new CommonConstant();
          expertHouse.house_type_info.id = updateExpertHouseDto.house_type_code;
        }
        if (updateExpertHouseDto.area_space_code !== undefined) {
          expertHouse.area_space_info = new CommonConstant();
          expertHouse.area_space_info.id = updateExpertHouseDto.area_space_code;
        }
        if (updateExpertHouseDto.label_id !== undefined) {
          expertHouse.label = new Label();
          expertHouse.label.id = updateExpertHouseDto.label_id;
        }
        if (
          isAdmin &&
          updateExpertHouseDto.status !== undefined &&
          expertHouse.status !== updateExpertHouseDto.status
        ) {
          expertHouse.status = updateExpertHouseDto.status;
          if (updateExpertHouseDto.status === GeneralProcessStatus.APPROVED) {
            expertHouse.approved_at = new Date();
            expertHouse.statusAdmin = new Admin();
            expertHouse.statusAdmin.id = userId;
            if (expertHouse.requester?.id) {
              await this.pointLogService.createWithType(
                {
                  user_id: expertHouse.requester?.id,
                  point: 200,
                  memo: `전문가 집들이`,
                },
                PointType.ExpertHouse,
              );
            }
          } else if (
            updateExpertHouseDto.status === GeneralProcessStatus.REJECTED
          ) {
            expertHouse.rejected_at = new Date();
            expertHouse.statusAdmin = new Admin();
            expertHouse.statusAdmin.id = userId;
          }
        }

        if (!isAdmin && userId !== undefined) {
          expertHouse.updated_by = userId;
        }
        // return await this.expertHouseRepository.update(id, expertHouse);
        return await this.expertHouseRepository.save(expertHouse);
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
      .andWhere('type = :type', { type: WishEntityType.ExpertHouse })
      .execute();

    await this.likeRepository
      .createQueryBuilder()
      .delete()
      .from(Like)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: LikeEntityType.ExpertHouse })
      .execute();
    return await this.expertHouseRepository.delete(id);
  }

  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.expertHouseRepository.update(id, { this_month_order: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetThisMonthPopularity(): Promise<void> {
    await this.expertHousePopularityRepository
      .createQueryBuilder()
      .update(ExpertHousePopularity)
      .set({
        prev_month_count: () => 'this_month_count',
        this_month_count: 0,
        prev_month_rank: () => 'this_month_rank',
        this_month_rank: 0,
      })
      .execute();
  }

  async resetThisMonthLikeCount(): Promise<void> {
    await this.expertHouseLikeCountRepository
      .createQueryBuilder()
      .update(ExpertHouseLikeCount)
      .set({
        prev_month_count: () => 'this_month_count',
        this_month_count: 0,
      })
      .execute();
  }

  async updatePopularPoint(): Promise<void> {
    // Update this_month_rank based on this_month_count ranking
    await this.expertHousePopularityRepository.query(`
      UPDATE expert_house_popularity
      JOIN (
        SELECT id, this_month_count,
              (
                SELECT COUNT(*) + 1
                FROM expert_house_popularity AS pp2
                WHERE pp2.this_month_count > pp1.this_month_count
              ) AS this_month_rank
        FROM expert_house_popularity AS pp1
      ) AS ranked
      ON expert_house_popularity.id = ranked.id
      SET expert_house_popularity.this_month_rank = ranked.this_month_rank;
    `);
    // Get all expert_houses
    const expertHouses = await this.expertHouseRepository.find({
      relations: {
        expertHousePopularity: true,
      },
      select: ['id', 'expertHousePopularity', 'view_point'],
    });

    for (const expertHouse of expertHouses) {
      // Calculate popularity_point based on your formula
      let popularityPoint = expertHouse.view_point;

      if (expertHouse.expertHousePopularity) {
        // If a record exists, update it
        popularityPoint =
          popularityPoint +
          (expertHouse.expertHousePopularity.this_month_rank
            ? expertHouses.length -
              expertHouse.expertHousePopularity.this_month_rank
            : 0);
        expertHouse.expertHousePopularity.popularity_point = popularityPoint;
        await this.expertHousePopularityRepository.save(
          expertHouse.expertHousePopularity,
        );
      } else {
        // If no record exists, create a new one
        const newPopularity = new ExpertHousePopularity();
        newPopularity.expertHouse = new ExpertHouse();
        newPopularity.expertHouse.id = expertHouse.id;
        newPopularity.popularity_point = popularityPoint;
        await this.expertHousePopularityRepository.save(newPopularity);
      }
    }
  }
}

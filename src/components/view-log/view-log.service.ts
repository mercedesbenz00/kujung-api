import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { ViewLog } from './entities/view-log.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { ViewLogEntityType } from '../../shared/constants';
import { SearchViewLogDto } from './dto/search-view-log.dto';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { Product } from './../product/entities/product.entity';
import { Portfolio } from '../homepage/portfolio/entities/portfolio.entity';
import { Notification } from '../homepage/notification/entities/notification.entity';
import { Wish } from '../wish/entities/wish.entity';
import { WishEntityType } from 'src/shared/constants';

@Injectable()
export class ViewLogService {
  constructor(
    @InjectRepository(ViewLog)
    private viewLogRepository: Repository<ViewLog>,
    @InjectRepository(OnlineHouse)
    private onlineHouseRepository: Repository<OnlineHouse>,
    @InjectRepository(ExpertHouse)
    private expertHouseRepository: Repository<ExpertHouse>,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  private getRepository(entityType: string): Repository<any> {
    if (entityType === ViewLogEntityType.ExpertHouse) {
      return this.expertHouseRepository;
    } else if (entityType === ViewLogEntityType.OnlineHouse) {
      return this.onlineHouseRepository;
    } else if (entityType === ViewLogEntityType.Product) {
      return this.productRepository;
    } else if (entityType === ViewLogEntityType.Portfolio) {
      return this.portfolioRepository;
    } else if (entityType === ViewLogEntityType.Notification) {
      return this.notificationRepository;
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  private getEntity(entityType: string): any {
    if (entityType === ViewLogEntityType.ExpertHouse) {
      return ExpertHouse;
    } else if (entityType === ViewLogEntityType.OnlineHouse) {
      return OnlineHouse;
    } else if (entityType === ViewLogEntityType.Product) {
      return Product;
    } else if (entityType === ViewLogEntityType.Portfolio) {
      return Portfolio;
    } else if (entityType === ViewLogEntityType.Notification) {
      return Notification;
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  private getTableName(entityType: string): string {
    if (entityType === ViewLogEntityType.ExpertHouse) {
      return 'expert_houses';
    } else if (entityType === ViewLogEntityType.OnlineHouse) {
      return 'online_houses';
    } else if (entityType === ViewLogEntityType.Product) {
      return 'products';
    } else if (entityType === ViewLogEntityType.Portfolio) {
      return 'portfolio';
    } else if (entityType === ViewLogEntityType.Notification) {
      return 'notifications';
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  private async updateViewCount(
    entityType: string,
    id: number,
    count = 1,
  ): Promise<any> {
    try {
      const queryBuilder = this.getRepository(entityType).createQueryBuilder(
        this.getTableName(entityType),
      );

      const updateResult = await queryBuilder
        .update(this.getEntity(entityType))
        .set({ view_count: () => `view_count + ${count}` })
        .where('id = :entityId', { entityId: id })
        .execute();
      return updateResult.affected > 0;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateViewLog(userId: number, createViewLogDto: CreateViewLogDto) {
    try {
      if (
        userId !== null &&
        userId !== undefined &&
        createViewLogDto.type === ViewLogEntityType.Product
      ) {
        const viewLogEntity = await this.viewLogRepository.findOne({
          where: {
            type: createViewLogDto.type,
            entity_id: createViewLogDto.entity_id,
            user_id: userId,
          },
        });
        if (viewLogEntity) {
          await this.viewLogRepository.update(viewLogEntity.id, {
            entity_id: viewLogEntity.entity_id,
          });
        } else {
          await this.viewLogRepository.save({
            ...createViewLogDto,
            user_id: userId,
          });
        }
      }
      return await this.updateViewCount(
        createViewLogDto.type,
        createViewLogDto.entity_id,
        1,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemListDeprecated(
    userId: number,
    pageOptionsDto: SearchViewLogDto,
  ): Promise<PageDto<ViewLog>> {
    const entityTypes = [
      'portfolio',
      'online_house',
      'expert_house',
      'product',
      'notification',
    ];
    const entityTables = [
      'portfolios',
      'online_houses',
      'expert_houses',
      'products',
      'notifications',
    ];
    const queryBuilder = this.viewLogRepository
      .createQueryBuilder('view_logs')
      .where('user_id = :userId', {
        userId: userId,
      });
    if (pageOptionsDto.type) {
      queryBuilder.andWhere('type = :type', { type: pageOptionsDto.type });
    }

    let i = 0;
    const unions = [];
    for (const entityType of entityTypes) {
      if (
        pageOptionsDto.type === entityType ||
        pageOptionsDto.type === undefined
      ) {
        const query = `
        (
          SELECT
            vl.id,
            vl.type,
            vl.entity_id,
            vl.user_id,
            vl.updated_at,
            JSON_OBJECT(
                'id', ${entityTypes[i]}.id
            ) AS item
          FROM
            view_logs AS vl
          LEFT JOIN ${entityTables[i]} ${entityTypes[i]}
            ON vl.entity_id = ${entityTypes[i]}.id AND vl.type = '${entityTypes[i]}'
          WHERE user_id=${userId} AND type = '${entityTypes[i]}'
          GROUP BY
            vl.id
        )
        `;
        unions.push(query);
      }
      i++;
    }

    const queryPage = pageOptionsDto.take
      ? `
    ORDER BY ${pageOptionsDto.sortBy || 'id'} ${pageOptionsDto.order}
    LIMIT ${pageOptionsDto.take}
    OFFSET ${pageOptionsDto.skip};
  `
      : `ORDER BY ${pageOptionsDto.sortBy || 'id'} ${
          pageOptionsDto.order
        }`;
    const unionQuery = `
    ${unions.join(` 
    UNION 
    `)}
    ${queryPage}
    `;
    // console.log('unionQuery', unionQuery);
    const entities = await this.viewLogRepository.query(unionQuery);
    const totalCount = await queryBuilder.getCount();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  private async getViewLogEntity(type: string, id: number, userId: number) {
    if (type === 'product') {
      const product = await this.productRepository.findOne({
        where: { id: id },
        relations: {
          productBlogs: true,
          productYoutube: true,
          productImages: true,
          tags: true,
          color_info: true,
          area_space_info: true,
          house_style_info: true,
          family_type_info: true,
          house_type_info: true,
          category_level1: true,
          category_level2: true,
          category_level3: true,
        },
        select: [
          'id',
          'title',
          'construction_law',
          'size_w',
          'size_l',
          'size_t',
          'desc',
          'selected_icons',
          'hidden',
          'recommended',
          'top_fixed',
          'wish_count',
          'view_count',
          'thumbnail_url',
          'created_at',
          'updated_at',
          'category_level1',
          'category_level2',
          'category_level3',
          'productBlogs',
          'productYoutube',
          'productImages',
          'tags',
          'color_info',
          'area_space_info',
          'house_style_info',
          'family_type_info',
          'house_type_info',
        ],
      });
      if (product) {
        const hasWish = await this.wishRepository
          .createQueryBuilder('wish_items')
          .where('wish_items.entity_id = :entity_id', {
            entity_id: id,
          })
          .andWhere(`wish_items.user_id = :user_id`, {
            user_id: userId,
          })
          .andWhere(`wish_items.type = :type`, {
            type: WishEntityType.Product,
          })
          .getOne();
        product.userWished = hasWish ? true : false;
      }
      return product;
    } else if (type === 'portfolio') {
      return await this.portfolioRepository.findOne({
        where: { id: id },
        relations: {
          portfolioImages: true,
        },
      });
    } else if (type === 'online_house') {
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
      if (onlineHouse) {
        const hasWish = await this.wishRepository
          .createQueryBuilder('wish_items')
          .where('wish_items.entity_id = :entity_id', {
            entity_id: id,
          })
          .andWhere(`wish_items.user_id = :user_id`, {
            user_id: userId,
          })
          .andWhere(`wish_items.type = :type`, {
            type: WishEntityType.OnlineHouse,
          })
          .getOne();
        onlineHouse.userWished = hasWish ? true : false;
      }
      return onlineHouse;
    } else if (type === 'expert_house') {
      const expertHouse = await this.expertHouseRepository.findOne({
        where: { id: id },
        relations: {
          tags: true,
          product: {
            category_level1: true,
            category_level2: true,
            category_level3: true,
            color_info: true,
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
        select: [
          'id',
          'image_url',
          'thumb_url',
          'building_addr',
          'title',
          'tags',
          'color_info',
          'family_type_info',
          'house_style_info',
          'house_type_info',
          'area_space_info',
          'label',
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
          'product',
        ],
      });
      if (expertHouse) {
        const hasWish = await this.wishRepository
          .createQueryBuilder('wish_items')
          .where('wish_items.entity_id = :entity_id', {
            entity_id: id,
          })
          .andWhere(`wish_items.user_id = :user_id`, {
            user_id: userId,
          })
          .andWhere(`wish_items.type = :type`, {
            type: WishEntityType.ExpertHouse,
          })
          .getOne();
        expertHouse.userWished = hasWish ? true : false;
      }

      return expertHouse;
    } else if (type === 'notification') {
      return await this.notificationRepository.findOne({
        where: { id: id },
      });
    }
  }

  async getItemList(
    userId: number,
    pageOptionsDto: SearchViewLogDto,
  ): Promise<PageDto<ViewLog>> {
    const queryBuilder = this.viewLogRepository
      .createQueryBuilder('view_logs')
      .where('user_id = :userId', {
        userId: userId,
      });
    if (pageOptionsDto.type) {
      queryBuilder.andWhere('type = :type', { type: pageOptionsDto.type });
    }
    queryBuilder.orderBy(
      !!pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'updated_at',
      pageOptionsDto.order,
    );
    if (pageOptionsDto.take) {
      queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
    }

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const itemList = [];
    for (const item of entities) {
      const entityObject = await this.getViewLogEntity(
        item.type,
        item.entity_id,
        userId,
      );
      itemList.push({ ...item, item: entityObject });
    }
    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(itemList, pageMetaDto);
  }

  findOne(id: number): Promise<ViewLog> {
    return this.viewLogRepository.findOneBy({ id: id });
  }

  async remove(id: number) {
    return await this.viewLogRepository.delete(id);
  }

  async removeBy(entityId: number, type: string) {
    await this.viewLogRepository
      .createQueryBuilder()
      .delete()
      .from(ViewLog)
      .where('entity_id = :entityId', { entityId })
      .andWhere('type = :type', { type })
      .execute();
  }
}

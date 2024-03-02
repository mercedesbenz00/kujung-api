import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { WishEntityType, Order } from '../../shared/constants';
import { SearchWishDto } from './dto/search-wish.dto';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { SmartStore } from './../smart-store/entities/smart-store.entity';
import { Product } from './../product/entities/product.entity';
import { ExpertHouseService } from '../expert-house/expert-house.service';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(OnlineHouse)
    private onlineHouseRepository: Repository<OnlineHouse>,
    @InjectRepository(ExpertHouse)
    private expertHouseRepository: Repository<ExpertHouse>,
    @InjectRepository(SmartStore)
    private smartStoreRepository: Repository<SmartStore>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private expertHouseService: ExpertHouseService,
  ) {}

  private getRepository(entityType: string): Repository<any> {
    if (entityType === WishEntityType.ExpertHouse) {
      return this.expertHouseRepository;
    } else if (entityType === WishEntityType.OnlineHouse) {
      return this.onlineHouseRepository;
    } else if (entityType === WishEntityType.Product) {
      return this.productRepository;
    } else if (entityType === WishEntityType.SmartStore) {
      return this.smartStoreRepository;
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  private getEntity(entityType: string): any {
    if (entityType === WishEntityType.ExpertHouse) {
      return ExpertHouse;
    } else if (entityType === WishEntityType.OnlineHouse) {
      return OnlineHouse;
    } else if (entityType === WishEntityType.Product) {
      return Product;
    } else if (entityType === WishEntityType.SmartStore) {
      return SmartStore;
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  private getTableName(entityType: string): string {
    if (entityType === WishEntityType.ExpertHouse) {
      return 'expert_houses';
    } else if (entityType === WishEntityType.OnlineHouse) {
      return 'online_houses';
    } else if (entityType === WishEntityType.Product) {
      return 'products';
    } else if (entityType === WishEntityType.SmartStore) {
      return 'smart_stores';
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  async updateWish(entityType: string, id: number, count = 1): Promise<any> {
    try {
      const queryBuilder = this.getRepository(entityType).createQueryBuilder(
        this.getTableName(entityType),
      );

      const updateResult = await queryBuilder
        .update(this.getEntity(entityType))
        .set({ wish_count: () => `wish_count + ${count}` })
        .where('id = :entityId', { entityId: id })
        .execute();
      return updateResult.affected > 0;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(userId: number, createWishDto: CreateWishDto) {
    if (userId !== null && userId !== undefined) {
      try {
        const result = await this.wishRepository.save({
          ...createWishDto,
          user_id: userId,
        });
        await this.updateWish(createWishDto.type, createWishDto.entity_id, 1);
        return result;
      } catch (e) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException(
      'User session info is invalid',
      HttpStatus.BAD_REQUEST,
    );
  }

  // async getItemListDeprecated(
  //   userId: number,
  //   pageOptionsDto: SearchWishDto,
  // ): Promise<PageDto<Wish>> {
  //   const queryBuilder = this.wishRepository.createQueryBuilder('wish_items');
  //   const entityTypes = [
  //     'smart_store',
  //     'online_house',
  //     'expert_house',
  //     'product',
  //   ];
  //   const entityObjects = [SmartStore, OnlineHouse, ExpertHouse, Product];

  //   let i = 0;
  //   for (const entityType of entityTypes) {
  //     if (
  //       pageOptionsDto.type === entityType ||
  //       pageOptionsDto.type === undefined
  //     ) {
  //       queryBuilder.leftJoinAndMapOne(
  //         'wish_items.item',
  //         entityObjects[i],
  //         entityType,
  //         `wish_items.entity_id = ${entityType}.id and wish_items.type = :type`,
  //         { type: entityType },
  //       );
  //     }
  //     i++;
  //   }

  //   queryBuilder.where('user_id = :userId', {
  //     userId: userId,
  //   });
  //   queryBuilder
  //     .orderBy(
  //       !!pageOptionsDto.sortBy
  //         ? `wish_items.${pageOptionsDto.sortBy}`
  //         : 'wish_items.created_at',
  //       pageOptionsDto.order,
  //     )
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take);

  //   const totalCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();

  //   const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

  //   return new PageDto(entities, pageMetaDto);
  // }

  private async getWishEntity(
    type: string,
    id: number,
    userId: number,
  ): Promise<any> {
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
        product.userWished = true;
      }
      return product;
    } else if (type === 'smart_store') {
      const smartStore = await this.smartStoreRepository.findOne({
        where: { id: id },
      });
      if (smartStore) {
        smartStore.userWished = true;
      }
      return smartStore;
    } else if (type === 'online_house') {
      const resultList = await this.expertHouseService.getHouseListForUser(
        {
          entity_type_list: ['online'],
          entity_id: id,
          take: 1,
          skip: 0,
          order: Order.DESC,
        },
        { id: userId },
      );
      if (resultList.items.length) {
        return resultList.items[0];
      }

      return null;
    } else if (type === 'expert_house') {
      const resultList = await this.expertHouseService.getHouseListForUser(
        {
          entity_type_list: ['expert'],
          entity_id: id,
          take: 1,
          skip: 0,
          order: Order.DESC,
        },
        { id: userId },
      );
      if (resultList.items.length) {
        return resultList.items[0];
      }

      return null;
    }
  }

  async getItemList(
    userId: number,
    pageOptionsDto: SearchWishDto,
  ): Promise<PageDto<Wish>> {
    const queryBuilder = this.wishRepository
      .createQueryBuilder('wish_items')
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
      const entityObject = await this.getWishEntity(
        item.type,
        item.entity_id,
        userId,
      );
      if (entityObject) {
        if (
          (item.type === 'online_house' || item.type === 'expert_house') &&
          entityObject.status !== 1
        ) {
          // ignore not approved house wish
        } else {
          itemList.push({ ...item, item: entityObject });
        }
      }
    }
    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(itemList, pageMetaDto);
  }

  findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOneBy({ id: id });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (wish) return await this.wishRepository.update(id, updateWishDto);
    return;
  }

  async remove(id: number) {
    return await this.wishRepository.delete(id);
  }

  async cancelWish(userId: number, createWishDto: CreateWishDto) {
    if (userId !== null && userId !== undefined) {
      try {
        const wishEntity = await this.wishRepository.findOne({
          where: {
            type: createWishDto.type,
            entity_id: createWishDto.entity_id,
            user_id: userId,
          },
        });
        if (wishEntity) {
          const result = await this.remove(wishEntity.id);
          await this.updateWish(
            createWishDto.type,
            createWishDto.entity_id,
            -1,
          );
          return result;
        } else {
          throw new HttpException(
            '이미 위시목록에 있지 않은 항목입니다.',
            HttpStatus.OK,
          );
        }
      } catch (e) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException(
      '회원정보가 유효하지 않습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

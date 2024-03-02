import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, ILike } from 'typeorm';
import { CreateSmartStoreDto } from './dto/create-smart-store.dto';
import { UpdateSmartStoreDto } from './dto/update-smart-store.dto';
import { SmartStore } from './entities/smart-store.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';
import { SearchSmartStoreDto } from './dto/search-smart-store.dto';
import { Wish } from '../wish/entities/wish.entity';
import { Like } from '../like/entities/like.entity';
import { LikeEntityType, WishEntityType } from 'src/shared/constants';

@Injectable()
export class SmartStoreService {
  constructor(
    @InjectRepository(SmartStore)
    private smartStoreRepository: Repository<SmartStore>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}
  async create(createSmartStoreDto: CreateSmartStoreDto) {
    return await this.smartStoreRepository.save(createSmartStoreDto);
  }

  async getItemList(
    pageOptionsDto: SearchSmartStoreDto,
    userInfo: any = null,
  ): Promise<PageDto<SmartStore>> {
    const whereCondition: any = {};

    const sqlQueryInfo: FindManyOptions = {
      order: {
        [pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'created_at']:
          pageOptionsDto.order,
        updated_at: Order.DESC,
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    };

    if (pageOptionsDto.display !== undefined) {
      whereCondition.display = pageOptionsDto.display;
    }
    if (pageOptionsDto.recommended !== undefined) {
      whereCondition.recommended = pageOptionsDto.recommended;
    }
    if (pageOptionsDto.category !== undefined) {
      whereCondition.category = ILike(`${pageOptionsDto.category}`);
    }
    if (pageOptionsDto.q) {
      whereCondition.name = ILike(`%${pageOptionsDto.q}%`);
    }
    if (Object.keys(whereCondition).length) {
      sqlQueryInfo.where = whereCondition;
    }
    const [entities, totalCount] = await this.smartStoreRepository.findAndCount(
      sqlQueryInfo,
    );
    if (
      entities.length &&
      userInfo &&
      userInfo.roles &&
      userInfo.roles.includes('user')
    ) {
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
          type: WishEntityType.SmartStore,
        })
        .getMany();

      const userEntityLikes = await this.likeRepository
        .createQueryBuilder('like_items')
        .where('like_items.entity_id IN (:...ids)', {
          ids: entities.map((entity) => entity.id),
        })
        .andWhere(`like_items.user_id = :user_id`, {
          user_id: userInfo.id,
        })
        .andWhere(`like_items.type = :type`, {
          type: LikeEntityType.SmartStore,
        })
        .getMany();

      entities.forEach((entity) => {
        const userEntityWish = userEntityWishes.find(
          (wish) => wish.entity_id === entity.id,
        );
        entity.userWished = userEntityWish ? true : false;

        const userEntityLike = userEntityLikes.find(
          (like) => like.entity_id === entity.id,
        );
        entity.userLiked = userEntityLike ? true : false;
      });
    }

    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.smartStoreRepository.count();
    }

    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number, userInfo: any = null): Promise<SmartStore> {
    const smartStore = await this.smartStoreRepository.findOneBy({ id: id });

    if (
      smartStore &&
      userInfo &&
      userInfo.roles &&
      userInfo.roles.includes('user')
    ) {
      const userEntityWish = await this.wishRepository
        .createQueryBuilder('wish_items')
        .where('wish_items.entity_id = :entity_id', {
          entity_id: id,
        })
        .andWhere(`wish_items.user_id = :user_id`, {
          user_id: userInfo.id,
        })
        .andWhere(`wish_items.type = :type`, {
          type: WishEntityType.SmartStore,
        })
        .getOne();
      smartStore.userWished = userEntityWish ? true : false;

      const userEntityLike = await this.likeRepository
        .createQueryBuilder('like_items')
        .where('like_items.entity_id = :entity_id', {
          entity_id: id,
        })
        .andWhere(`like_items.user_id = :user_id`, {
          user_id: userInfo.id,
        })
        .andWhere(`like_items.type = :type`, {
          type: LikeEntityType.SmartStore,
        })
        .getOne();
      smartStore.userLiked = userEntityLike ? true : false;
    }

    return smartStore;
  }

  async update(id: number, updateSmartStoreDto: UpdateSmartStoreDto) {
    const tag = await this.findOne(id);
    if (tag)
      return await this.smartStoreRepository.update(id, updateSmartStoreDto);
    return;
  }

  async remove(id: number) {
    await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: WishEntityType.SmartStore })
      .execute();

    await this.likeRepository
      .createQueryBuilder()
      .delete()
      .from(Like)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: LikeEntityType.SmartStore })
      .execute();
    return await this.smartStoreRepository.delete(id);
  }
}

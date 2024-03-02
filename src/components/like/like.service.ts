import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order, LikeEntityType } from '../../shared/constants';
import { SearchLikeDto } from './dto/search-like.dto';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { OnlineHouseLikeCount } from '../online-house/entities/online-house-like-count.entity';
import { ExpertHouseLikeCount } from '../expert-house/entities/expert-house-like-count.entity';
import { Notification } from '../homepage/notification/entities/notification.entity';
import { Portfolio } from '../homepage/portfolio/entities/portfolio.entity';
import { SmartStore } from '../smart-store/entities/smart-store.entity';
import { User } from '../users/entities/user.entity';
import { PointLogService } from '../point-log/point-log.service';
import { PointType } from '../../shared/constants';

@Injectable()
export class LikeService {
  constructor(
    private pointLogService: PointLogService,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(OnlineHouse)
    private onlineHouseRepository: Repository<OnlineHouse>,
    @InjectRepository(ExpertHouse)
    private expertHouseRepository: Repository<ExpertHouse>,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(SmartStore)
    private smartStoreRepository: Repository<SmartStore>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OnlineHouseLikeCount)
    private onlineHouseLikeCountRepository: Repository<OnlineHouseLikeCount>,
    @InjectRepository(ExpertHouseLikeCount)
    private expertHouseLikeCountRepository: Repository<ExpertHouseLikeCount>,
  ) {}

  private getRepository(entityType: string): Repository<any> {
    if (entityType === LikeEntityType.ExpertHouse) {
      return this.expertHouseRepository;
    } else if (entityType === LikeEntityType.OnlineHouse) {
      return this.onlineHouseRepository;
    } else if (entityType === LikeEntityType.Notification) {
      return this.notificationRepository;
    } else if (entityType === LikeEntityType.Portfolio) {
      return this.portfolioRepository;
    } else if (entityType === LikeEntityType.SmartStore) {
      return this.smartStoreRepository;
    } else if (entityType === LikeEntityType.User) {
      return this.userRepository;
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  private getEntity(entityType: string): any {
    if (entityType === LikeEntityType.ExpertHouse) {
      return ExpertHouse;
    } else if (entityType === LikeEntityType.OnlineHouse) {
      return OnlineHouse;
    } else if (entityType === LikeEntityType.Notification) {
      return Notification;
    } else if (entityType === LikeEntityType.Portfolio) {
      return Portfolio;
    } else if (entityType === LikeEntityType.SmartStore) {
      return SmartStore;
    } else if (entityType === LikeEntityType.User) {
      return User;
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  private getTableName(entityType: string): string {
    if (entityType === LikeEntityType.ExpertHouse) {
      return 'expert_houses';
    } else if (entityType === LikeEntityType.OnlineHouse) {
      return 'online_houses';
    } else if (entityType === LikeEntityType.Notification) {
      return 'notifications';
    } else if (entityType === LikeEntityType.Portfolio) {
      return 'portfolios';
    } else if (entityType === LikeEntityType.SmartStore) {
      return 'smart_stores';
    } else if (entityType === LikeEntityType.User) {
      return 'users';
    }

    throw new HttpException('Invalid entity type', HttpStatus.BAD_REQUEST);
  }

  async updateLike(entityType: string, id: number, count = 1): Promise<any> {
    try {
      const queryBuilder = this.getRepository(entityType).createQueryBuilder(
        this.getTableName(entityType),
      );
      const updateResult = await queryBuilder
        .update(this.getEntity(entityType))
        .set({ like_count: () => `like_count + ${count}` })
        .where('id = :entityId', { entityId: id })
        .execute();

      if (entityType === LikeEntityType.ExpertHouse) {
        await this.updateExpertHouseLikeCount(id, count);
      } else if (entityType === LikeEntityType.OnlineHouse) {
        await this.updateOnlineHouseLikeCount(id, count);
      }
      return updateResult.affected > 0;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateOnlineHouseLikeCount(id: number, count: number): Promise<void> {
    // Check if a LikeCount record exists
    let likeCount = await this.onlineHouseLikeCountRepository.findOne({
      where: { onlineHouse: { id: id } },
    });

    if (!likeCount) {
      // If no record exists, create a new one
      likeCount = this.onlineHouseLikeCountRepository.create({
        this_month_count: count,
        onlineHouse: { id: id },
      });
    } else {
      // If a record exists, increment the count
      likeCount.this_month_count += count;
    }

    // Save the updated or new LikeCount record
    if (likeCount.this_month_count >= 0) {
      await this.onlineHouseLikeCountRepository.save(likeCount);
    }
  }
  async updateExpertHouseLikeCount(id: number, count: number): Promise<void> {
    // Check if a LikeCount record exists
    let likeCount = await this.expertHouseLikeCountRepository.findOne({
      where: { expertHouse: { id: id } },
    });

    if (!likeCount) {
      // If no record exists, create a new one
      likeCount = this.expertHouseLikeCountRepository.create({
        this_month_count: count,
        expertHouse: { id: id },
      });
    } else {
      // If a record exists, increment the count
      likeCount.this_month_count += count;
    }

    // Save the updated or new LikeCount record
    if (likeCount.this_month_count >= 0) {
      await this.expertHouseLikeCountRepository.save(likeCount);
    }
  }

  async create(userId: number, createLikeDto: CreateLikeDto) {
    if (userId !== null && userId !== undefined) {
      try {
        const result = await this.likeRepository.save({
          ...createLikeDto,
          user_id: userId,
        });
        await this.updateLike(createLikeDto.type, createLikeDto.entity_id, 1);
        if (createLikeDto.type === LikeEntityType.ExpertHouse) {
          await this.pointLogService.createWithType(
            {
              user_id: userId,
              point: 3,
              memo: `전문가 집들이 좋아요. id: ${createLikeDto.entity_id}`,
            },
            PointType.ExpertHouse,
          );
        } else if (createLikeDto.type === LikeEntityType.OnlineHouse) {
          await this.pointLogService.createWithType(
            {
              user_id: userId,
              point: 3,
              memo: `랜선 집들이 좋아요. id: ${createLikeDto.entity_id}`,
            },
            PointType.OnlineHouse,
          );
        }
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

  async getItemList(
    userId: number,
    pageOptionsDto: SearchLikeDto,
  ): Promise<PageDto<Like>> {
    const queryBuilder = this.likeRepository.createQueryBuilder('like_items');
    const entityTypes = [
      'notification',
      'expert_house',
      'online_house',
      'portfolio',
      'user',
    ];
    const entityObjects = [
      Notification,
      ExpertHouse,
      OnlineHouse,
      Portfolio,
      User,
    ];

    let i = 0;
    queryBuilder.where('user_id = :userId', {
      userId: userId,
    });
    for (const entityType of entityTypes) {
      if (
        pageOptionsDto.type === entityType ||
        pageOptionsDto.type === undefined
      ) {
        queryBuilder.leftJoinAndMapOne(
          'like_items.item',
          entityObjects[i],
          entityType,
          `like_items.entity_id = ${entityType}.id and like_items.type = :type`,
          { type: entityType },
        );
      }
      i++;
    }

    queryBuilder
      .orderBy(
        !!pageOptionsDto.sortBy
          ? `like_items.${pageOptionsDto.sortBy}`
          : 'like_items.created_at',
        pageOptionsDto.order,
      )
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number): Promise<Like> {
    return this.likeRepository.findOneBy({ id: id });
  }

  async remove(id: number) {
    return await this.likeRepository.delete(id);
  }

  async unlike(userId: number, createLikeDto: CreateLikeDto) {
    if (userId !== null && userId !== undefined) {
      try {
        const likeEntity = await this.likeRepository.findOne({
          where: {
            type: createLikeDto.type,
            entity_id: createLikeDto.entity_id,
            user_id: userId,
          },
        });
        if (likeEntity) {
          const result = await this.remove(likeEntity.id);
          await this.updateLike(
            createLikeDto.type,
            createLikeDto.entity_id,
            -1,
          );
          return result;
        } else {
          throw new HttpException(
            '좋아요를 선택한 항목이 아닙니다.',
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

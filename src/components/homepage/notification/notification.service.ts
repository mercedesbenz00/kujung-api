import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SearchNotificationDto } from './dto/search-notification.dto';
import { Notification } from './entities/notification.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import {
  Order,
  LikeEntityType,
  ViewLogEntityType,
} from '../../../shared/constants';
import { Like } from './../../like/entities/like.entity';
import { ViewLogService } from '../../view-log/view-log.service';

@Injectable()
export class NotificationService {
  constructor(
    private viewLogService: ViewLogService,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const newNotification = new Notification();
      newNotification.title = createNotificationDto.title;
      if (createNotificationDto.content) {
        const contentBuffer = Buffer.from(
          createNotificationDto.content,
          'utf-8',
        );
        newNotification.content = contentBuffer;
      }
      newNotification.url = createNotificationDto.url;
      newNotification.thumb_url = createNotificationDto.thumb_url;
      newNotification.thumb_url_mobile = createNotificationDto.thumb_url_mobile;
      if (createNotificationDto.top_fixed !== undefined) {
        newNotification.top_fixed = createNotificationDto.top_fixed;
      }

      return await this.notificationRepository.save(newNotification);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchNotificationDto,
    userInfo: any = null,
  ): Promise<PageDto<Notification>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.notificationRepository
        .createQueryBuilder('notifications')
        .select([
          'notifications.id',
          'notifications.title',
          'notifications.top_fixed',
          'notifications.url',
          'notifications.thumb_url',
          'notifications.thumb_url_mobile',
          'notifications.like_count',
          'notifications.view_count',
          'notifications.created_at',
          'notifications.updated_at',
        ]);

      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(notifications.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `notifications.created_at BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
        query = query.andWhere(
          `notifications.created_at BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`notifications.created_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`notifications.created_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`notifications.top_fixed`, Order.DESC)
        .addOrderBy(`notifications.${orderBy}`, pageOptionsDto.order);

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
            type: LikeEntityType.Notification,
          })
          .getMany();

        entities.forEach((entity) => {
          const userEntityLike = userEntityLikes.find(
            (like) => like.entity_id === entity.id,
          );
          entity.userLiked = userEntityLike ? true : false;
        });
      }

      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.notificationRepository.count({
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
    needConvert = false,
  ): Promise<any> {
    const notification = await this.notificationRepository.findOne({
      where: { id: id },
    });
    if (
      notification &&
      canUpdateViewCount &&
      ((userInfo && userInfo.roles && userInfo.roles.includes('user')) ||
        !userInfo)
    ) {
      await this.viewLogService.updateViewLog(userInfo?.id, {
        type: ViewLogEntityType.Notification,
        entity_id: id,
      });
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
            type: LikeEntityType.Notification,
          })
          .getOne();
        notification.userLiked = userEntityLike ? true : false;
      }
    }

    if (needConvert && notification && notification.content) {
      const contentString = notification.content?.toString('utf-8');
      return { ...notification, content: contentString };
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    try {
      const notification = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateNotificationDto[field] !== undefined)
          notification[field] = updateNotificationDto[field];
      };

      if (notification) {
        updateValue('title');
        updateValue('top_fixed');
        updateValue('url');
        updateValue('thumb_url');
        updateValue('thumb_url_mobile');
        if (updateNotificationDto.content) {
          const contentBuffer = Buffer.from(
            updateNotificationDto.content,
            'utf-8',
          );
          notification.content = contentBuffer;
        }
        return await this.notificationRepository.save(notification);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    await this.likeRepository
      .createQueryBuilder()
      .delete()
      .from(Like)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: LikeEntityType.Notification })
      .execute();
    return await this.notificationRepository.delete(id);
  }
}

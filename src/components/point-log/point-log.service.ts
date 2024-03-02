import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePointLogDto } from './dto/create-point-log.dto';
import { UpdatePointLogDto } from './dto/update-point-log.dto';
import { PointLog } from './entities/point-log.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { SearchPointLogDto } from './dto/search-point-log.dto';
import { User } from '../users/entities/user.entity';
import { PointType } from '../../shared/constants';

@Injectable()
export class PointLogService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(PointLog)
    private pointLogRepository: Repository<PointLog>,
  ) {}
  async create(createPointLogDto: CreatePointLogDto) {
    try {
      const newPointLog = new PointLog();
      newPointLog.point = createPointLogDto.point;
      newPointLog.memo = createPointLogDto.memo;
      newPointLog.type = PointType.Direct;
      newPointLog.is_direct = true;
      if (createPointLogDto.user_id !== undefined) {
        newPointLog.user = new User();
        newPointLog.user.id = createPointLogDto.user_id;
      }

      const result = await this.pointLogRepository.save(newPointLog);
      if (createPointLogDto.user_id !== undefined) {
        await this.usersService.updatePoint(
          createPointLogDto.user_id,
          createPointLogDto.point,
        );
      }
      return result;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createWithType(createPointLogDto: CreatePointLogDto, type: PointType) {
    try {
      const newPointLog = new PointLog();
      newPointLog.point = createPointLogDto.point;
      newPointLog.memo = createPointLogDto.memo;
      newPointLog.type = type;
      if (type === PointType.Direct) {
        newPointLog.is_direct = true;
      } else {
        newPointLog.is_direct = false;
      }
      if (createPointLogDto.user_id !== undefined) {
        newPointLog.user = new User();
        newPointLog.user.id = createPointLogDto.user_id;
      }

      const result = await this.pointLogRepository.save(newPointLog);
      if (createPointLogDto.user_id !== undefined) {
        await this.usersService.updatePoint(
          createPointLogDto.user_id,
          createPointLogDto.point,
        );
      }
      return result;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchPointLogDto,
  ): Promise<PageDto<PointLog>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.pointLogRepository
        .createQueryBuilder('pointLogs')
        .leftJoinAndSelect('pointLogs.user', 'user')
        .select([
          'pointLogs.id',
          'pointLogs.point',
          'pointLogs.memo',
          'pointLogs.type',
          'pointLogs.is_direct',
          'pointLogs.created_at',
          'pointLogs.updated_at',
          'user.id',
          'user.name',
          'user.email',
        ]);

      if (pageOptionsDto.user_id !== undefined) {
        query = query.andWhere(`user.id = :user_id`, {
          user_id: pageOptionsDto.user_id,
        });
      }

      if (pageOptionsDto.is_direct !== undefined) {
        query = query.andWhere(`pointLogs.is_direct = :is_direct`, {
          is_direct: pageOptionsDto.is_direct,
        });
      }

      if (pageOptionsDto.typeList && pageOptionsDto.typeList.length) {
        query = query.andWhere(`pointLogs.type IN (:...typeList)`, {
          typeList: pageOptionsDto.typeList,
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`pointLogs.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.pointLogRepository.count({
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

  async findOne(id: number): Promise<PointLog> {
    const entity = await this.pointLogRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
      },
    });
    delete entity?.user?.password;
    return entity;
  }

  async update(id: number, updatePointLogDto: UpdatePointLogDto) {
    try {
      const entity = await this.findOne(id);
      if (entity) {
        const result = await this.pointLogRepository.update(
          id,
          updatePointLogDto,
        );
        if (updatePointLogDto.point !== undefined) {
          const changedPoint = updatePointLogDto.point - entity.point;
          if (changedPoint != 0) {
            await this.usersService.updatePoint(entity.user?.id, changedPoint);
          }
        }

        return result;
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (entity) {
      const result = await this.pointLogRepository.delete(id);
      await this.usersService.updatePoint(entity.user?.id, entity.point * -1);
      return result;
    }
  }
}

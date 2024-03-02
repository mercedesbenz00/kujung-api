import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  Repository,
  ILike,
  Between,
  LessThan,
  MoreThan,
  Not,
  IsNull,
} from 'typeorm';
import { CreatePointProductOrderDto } from './dto/create-point-product-order.dto';
import { UpdatePointProductOrderDto } from './dto/update-point-product-order.dto';
import { PointProductOrder } from './entities/point-product-order.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order, PointType } from '../../shared/constants';
import { SearchPointProductOrderDto } from './dto/search-point-product-order.dto';
import { User } from '../users/entities/user.entity';
import { PointProduct } from '../point-product/entities/point-product.entity';
import { UsersService } from '../users/users.service';
import { PointLogService } from '../point-log/point-log.service';

@Injectable()
export class PointProductOrderService {
  constructor(
    private usersService: UsersService,
    private pointLogService: PointLogService,
    @InjectRepository(PointProduct)
    private pointProducRepository: Repository<PointProduct>,
    @InjectRepository(PointProductOrder)
    private pointProductOrderRepository: Repository<PointProductOrder>,
  ) {}
  async create(
    createPointProductOrderDto: CreatePointProductOrderDto,
    userInfo: any = null,
  ) {
    try {
      const pointProductOrder = await this.pointProductOrderRepository.create(
        createPointProductOrderDto,
      );
      pointProductOrder.requester = new User();
      pointProductOrder.requester.id = createPointProductOrderDto.requester_id;
      pointProductOrder.pointProduct = new PointProduct();
      pointProductOrder.pointProduct.id = createPointProductOrderDto.product_id;

      if (userInfo && userInfo.roles && userInfo.roles.includes('user')) {
        const pointProduct = await this.pointProducRepository.findOneBy({
          id: createPointProductOrderDto.product_id,
        });
        const user = await this.usersService.getUserInfo(
          createPointProductOrderDto.requester_id,
        );
        if (pointProduct && user) {
          if (user.point < pointProduct.point) {
            throw new HttpException(
              '포인트가 충분하지 않습니다.',
              HttpStatus.NOT_ACCEPTABLE,
            );
          }

          await this.pointLogService.createWithType(
            {
              user_id: createPointProductOrderDto.requester_id,
              point: -1 * pointProduct.point,
              memo: `포인트몰 주문신청: ${pointProduct.id}`,
            },
            PointType.Order,
          );
        }
      }
      return await this.pointProductOrderRepository.save(pointProductOrder);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchPointProductOrderDto,
  ): Promise<PageDto<PointProductOrder>> {
    const orderBy = pageOptionsDto.sortBy || 'id';
    let query = this.pointProductOrderRepository
      .createQueryBuilder('point_product_orders')
      .leftJoinAndSelect('point_product_orders.requester', 'requester')
      .leftJoinAndSelect('point_product_orders.pointProduct', 'pointProduct')
      .select([
        'point_product_orders.id',
        'point_product_orders.recipient_name',
        'point_product_orders.recipient_phone',
        'point_product_orders.delivery_addr',
        'point_product_orders.delivery_addr_sub',
        'point_product_orders.delivery_zonecode',
        'point_product_orders.delivery_memo',
        'point_product_orders.status',
        'point_product_orders.created_at',
        'point_product_orders.updated_at',
        'requester.id',
        'requester.name',
        'requester.email',
        'requester.phone',
        'requester.point',
        'pointProduct.name',
        'pointProduct.point',
        'pointProduct.summary',
        'pointProduct.thumb_url',
        'pointProduct.created_at',
      ]);

    query = query.andWhere(`pointProduct.id IS NOT NULL`);
    if (pageOptionsDto.requester_id !== undefined) {
      query = query.andWhere(`requester.id = :requester_id`, {
        requester_id: pageOptionsDto.requester_id,
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
    if (pageOptionsDto.from && pageOptionsDto.to) {
      query = query.andWhere(
        `point_product_orders.created_at BETWEEN :from AND :to`,
        {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        },
      );
    } else if (pageOptionsDto.from) {
      query = query.andWhere(`point_product_orders.created_at >= :from`, {
        from: new Date(pageOptionsDto.from),
      });
    } else if (pageOptionsDto.to) {
      query = query.andWhere(`point_product_orders.created_at <= :to`, {
        to: new Date(pageOptionsDto.to),
      });
    }

    if (pageOptionsDto.statusList && pageOptionsDto.statusList.length) {
      query = query.andWhere(
        `point_product_orders.status IN (:...statusList)`,
        {
          statusList: pageOptionsDto.statusList,
        },
      );
    }

    // if (pageOptionsDto.from) {
    //   query = query.andWhere(`pointProduct.created_at >= :from`, {
    //     from: new Date(pageOptionsDto.from),
    //   });
    // } else if (pageOptionsDto.to) {
    //   query = query.andWhere(`pointProduct.created_at <= :to`, {
    //     to: new Date(pageOptionsDto.to),
    //   });
    // }
    query = query
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .orderBy(`point_product_orders.${orderBy}`, Order.DESC);

    const [entities, totalCount] = await query.getManyAndCount();
    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.pointProductOrderRepository.count({
        relations: {
          pointProduct: true,
        },
        where: {
          pointProduct: Not(IsNull()),
        },
      });
    }
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<PointProductOrder> {
    const entity = await this.pointProductOrderRepository.findOne({
      where: { id: id },
      relations: {
        requester: true,
        pointProduct: true,
      },
    });
    delete entity?.requester?.password;
    return entity;
  }

  async update(
    id: number,
    updatePointProductOrderDto: UpdatePointProductOrderDto,
  ) {
    try {
      const entity = await this.findOne(id);
      if (entity) {
        if (updatePointProductOrderDto.status === 'cancelled') {
          if (entity.requester && entity.pointProduct) {
            await this.pointLogService.createWithType(
              {
                user_id: entity.requester.id,
                point: entity.pointProduct.point,
                memo: `포인트몰 주문취소소: ${entity.pointProduct.id}`,
              },
              PointType.Order,
            );
          }
        }
        return await this.pointProductOrderRepository.update(
          id,
          updatePointProductOrderDto,
        );
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.pointProductOrderRepository.delete(id);
  }
}

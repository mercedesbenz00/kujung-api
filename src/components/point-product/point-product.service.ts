import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, ILike } from 'typeorm';
import { CreatePointProductDto } from './dto/create-point-product.dto';
import { UpdatePointProductDto } from './dto/update-point-product.dto';
import { PointProduct } from './entities/point-product.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { Order } from '../../shared/constants';
import { SearchPointProductDto } from './dto/search-point-product.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';

@Injectable()
export class PointProductService {
  constructor(
    @InjectRepository(PointProduct)
    private pointProductRepository: Repository<PointProduct>,
  ) {}
  async create(createPointProductDto: CreatePointProductDto) {
    try {
      const newPointProduct = new PointProduct();
      newPointProduct.name = createPointProductDto.name;
      newPointProduct.summary = createPointProductDto.summary;
      newPointProduct.point = createPointProductDto.point;
      newPointProduct.thumb_url = createPointProductDto.thumb_url;
      newPointProduct.is_bee = createPointProductDto.is_bee;
      newPointProduct.view_point = createPointProductDto.view_point;
      if (createPointProductDto.desc) {
        const contentBuffer = Buffer.from(createPointProductDto.desc, 'utf-8');
        newPointProduct.desc = contentBuffer;
      }

      return await this.pointProductRepository.save(newPointProduct);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchPointProductDto,
  ): Promise<PageDto<PointProduct>> {
    const whereCondition: any = {};

    const sqlQueryInfo: FindManyOptions = {
      order: {
        [pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'seq']:
          pageOptionsDto.order,
        id: pageOptionsDto.order,
      },
      select: [
        'id',
        'name',
        'summary',
        'point',
        'thumb_url',
        'is_bee',
        'view_point',
        'seq',
        'created_at',
        'updated_at',
      ],
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    };

    if (pageOptionsDto.is_bee !== undefined) {
      whereCondition.is_bee = pageOptionsDto.is_bee;
    }
    const whereGlobalCondition: any = { ...whereCondition };

    if (pageOptionsDto.q) {
      const queryType = pageOptionsDto.q_type || 'name';
      whereCondition[queryType] = ILike(`%${pageOptionsDto.q}%`);
    }
    if (Object.keys(whereCondition).length) {
      sqlQueryInfo.where = whereCondition;
    }
    const [entities, totalCount] =
      await this.pointProductRepository.findAndCount(sqlQueryInfo);
    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.pointProductRepository.count({
        where: whereGlobalCondition,
      });
    }
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(entities, pageMetaDto);
  }

  private getCompare(order: string, isNext = true): string {
    if (order === Order.ASC) {
      return isNext ? '>' : '<';
    } else {
      return isNext ? '<' : '>';
    }
  }

  async getNextPointProduct(
    id: number,
    pageOptionsDto: SearchPointProductDto,
  ): Promise<PointProduct> {
    try {
      const curPointProduct = await this.findOne(id, false, [
        'id',
        'name',
        'summary',
        'point',
        'thumb_url',
        'is_bee',
        'view_point',
        'seq',
        'created_at',
        'updated_at',
      ]);
      if (curPointProduct) {
        const orderBy = pageOptionsDto.sortBy || 'seq';
        let query = this.pointProductRepository
          .createQueryBuilder('point_products')
          .select([
            'point_products.id',
            'point_products.name',
            'point_products.desc',
            'point_products.summary',
            'point_products.point',
            'point_products.thumb_url',
            'point_products.is_bee',
            'point_products.view_point',
            'point_products.seq',
            'point_products.created_at',
            'point_products.updated_at',
          ]);
        if (pageOptionsDto.q !== undefined) {
          query = query.andWhere(
            `LOWER(point_products.${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
            {
              pattern: `%${pageOptionsDto.q}%`,
            },
          );
        }

        if (pageOptionsDto.is_bee !== undefined) {
          query = query.andWhere(`point_products.is_bee = :is_bee`, {
            is_bee: pageOptionsDto.is_bee,
          });
        }

        let queryDuplicateList = query.clone();
        if (
          curPointProduct[orderBy] === null ||
          curPointProduct[orderBy] === undefined
        ) {
          queryDuplicateList = queryDuplicateList.andWhere(
            `point_products.${orderBy} IS NULL`,
          );
        } else if (orderBy.includes('_at')) {
          const date1 = new Date(curPointProduct[orderBy]);
          const date2 = new Date(date1.getTime() + 1000);
          queryDuplicateList = queryDuplicateList.andWhere(
            `point_products.${orderBy} BETWEEN :checkValue1 AND :checkValue2`,
            {
              checkValue1: date1,
              checkValue2: date2,
            },
          );
        } else {
          queryDuplicateList = queryDuplicateList.andWhere(
            `point_products.${orderBy} = :checkValue`,
            {
              checkValue: curPointProduct[orderBy],
            },
          );
        }

        queryDuplicateList = queryDuplicateList.orderBy(
          `point_products.${orderBy}`,
          pageOptionsDto.order,
        );
        queryDuplicateList = queryDuplicateList.addOrderBy(
          `point_products.id`,
          pageOptionsDto.order,
        );

        const duplicatList = await queryDuplicateList.getMany();
        let nextPointProduct = null;
        if (duplicatList.length > 1) {
          for (let i = 0; i < duplicatList.length; i++) {
            if (Number(duplicatList[i].id) === id) {
              if (i < duplicatList.length - 1) {
                nextPointProduct = duplicatList[i + 1];
              }
            }
          }
        }

        if (nextPointProduct) {
          if (nextPointProduct.desc) {
            const contentString = nextPointProduct.desc?.toString('utf-8');
            return { ...nextPointProduct, desc: contentString };
          }
        }

        if (curPointProduct[orderBy]) {
          query = query.andWhere(
            `point_products.${orderBy} ${this.getCompare(
              pageOptionsDto.order,
            )} :orderValue`,
            {
              orderValue: orderBy.includes('_at')
                ? new Date(curPointProduct[orderBy])
                : curPointProduct[orderBy],
            },
          );
        }
        query = query.andWhere(`point_products.id != :idValue`, {
          idValue: curPointProduct.id,
        });

        query = query.orderBy(
          `point_products.${orderBy}`,
          pageOptionsDto.order,
        );
        query = query.addOrderBy(`point_products.id`, pageOptionsDto.order);
        nextPointProduct = await query.getOne();
        if (nextPointProduct && nextPointProduct.desc) {
          const contentString = nextPointProduct.desc?.toString('utf-8');
          return { ...nextPointProduct, desc: contentString };
        }
        return nextPointProduct;
      }
      return null;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPrevPointProduct(
    id: number,
    pageOptionsDto: SearchPointProductDto,
  ): Promise<PointProduct> {
    try {
      const curPointProduct = await this.findOne(id, false, [
        'id',
        'name',
        'summary',
        'point',
        'thumb_url',
        'is_bee',
        'view_point',
        'seq',
        'created_at',
        'updated_at',
      ]);
      if (curPointProduct) {
        const orderBy = pageOptionsDto.sortBy || 'seq';
        let query = this.pointProductRepository
          .createQueryBuilder('point_products')
          .select([
            'point_products.id',
            'point_products.name',
            'point_products.desc',
            'point_products.summary',
            'point_products.point',
            'point_products.thumb_url',
            'point_products.is_bee',
            'point_products.view_point',
            'point_products.seq',
            'point_products.created_at',
            'point_products.updated_at',
          ]);
        if (pageOptionsDto.q !== undefined) {
          query = query.andWhere(
            `LOWER(point_products.${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
            {
              pattern: `%${pageOptionsDto.q}%`,
            },
          );
        }

        if (pageOptionsDto.is_bee !== undefined) {
          query = query.andWhere(`point_products.is_bee = :is_bee`, {
            is_bee: pageOptionsDto.is_bee,
          });
        }

        let queryDuplicateList = query.clone();
        if (
          curPointProduct[orderBy] === null ||
          curPointProduct[orderBy] === undefined
        ) {
          queryDuplicateList = queryDuplicateList.andWhere(
            `point_products.${orderBy} IS NULL`,
          );
        } else if (orderBy.includes('_at')) {
          const date1 = new Date(curPointProduct[orderBy]);
          const date2 = new Date(date1.getTime() + 1000);
          queryDuplicateList = queryDuplicateList.andWhere(
            `point_products.${orderBy} BETWEEN :checkValue1 AND :checkValue2`,
            {
              checkValue1: date1,
              checkValue2: date2,
            },
          );
        } else {
          queryDuplicateList = queryDuplicateList.andWhere(
            `point_products.${orderBy} = :checkValue`,
            {
              checkValue: curPointProduct[orderBy],
            },
          );
        }

        queryDuplicateList = queryDuplicateList.orderBy(
          `point_products.${orderBy}`,
          pageOptionsDto.order,
        );
        queryDuplicateList = queryDuplicateList.addOrderBy(
          `point_products.id`,
          pageOptionsDto.order,
        );

        const duplicatList = await queryDuplicateList.getMany();
        let prevPointProduct = null;
        if (duplicatList.length > 1) {
          for (let i = 0; i < duplicatList.length; i++) {
            if (Number(duplicatList[i].id) === id) {
              if (i > 0) {
                prevPointProduct = duplicatList[i - 1];
              }
            }
          }
        }

        if (prevPointProduct) {
          if (prevPointProduct.desc) {
            const contentString = prevPointProduct.desc?.toString('utf-8');
            return { ...prevPointProduct, desc: contentString };
          }
        }

        if (curPointProduct[orderBy]) {
          query = query.andWhere(
            `point_products.${orderBy} ${this.getCompare(
              pageOptionsDto.order,
              false,
            )} :orderValue`,
            {
              orderValue: orderBy.includes('_at')
                ? new Date(curPointProduct[orderBy])
                : curPointProduct[orderBy],
            },
          );
        }
        query = query.andWhere(`point_products.id != :idValue`, {
          idValue: curPointProduct.id,
        });

        query = query.orderBy(
          `point_products.${orderBy}`,
          pageOptionsDto.order === 'ASC' ? 'DESC' : 'ASC',
        );
        query = query.addOrderBy(
          `point_products.id`,
          pageOptionsDto.order === 'ASC' ? 'DESC' : 'ASC',
        );

        prevPointProduct = await query.getOne();

        if (prevPointProduct) {
          if (prevPointProduct.desc) {
            const contentString = prevPointProduct.desc?.toString('utf-8');
            return { ...prevPointProduct, desc: contentString };
          }
        }
        return prevPointProduct;
      }
      return null;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(
    id: number,
    needConvert = false,
    selectOption = null,
  ): Promise<any> {
    const pointProduct = selectOption
      ? await this.pointProductRepository.findOne({
          where: { id: id },
          select: selectOption,
        })
      : await this.pointProductRepository.findOne({
          where: { id: id },
        });

    if (needConvert && pointProduct && pointProduct.desc) {
      const contentString = pointProduct.desc?.toString('utf-8');
      return { ...pointProduct, desc: contentString };
    }
    return pointProduct;
  }

  async update(id: number, updatePointProductDto: UpdatePointProductDto) {
    try {
      const entity = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updatePointProductDto[field] !== undefined)
          entity[field] = updatePointProductDto[field];
      };
      if (entity) {
        updateValue('name');
        updateValue('summary');
        updateValue('point');
        updateValue('thumb_url');
        updateValue('is_bee');
        updateValue('view_point');

        if (updatePointProductDto.desc) {
          const contentBuffer = Buffer.from(
            updatePointProductDto.desc,
            'utf-8',
          );
          entity.desc = contentBuffer;
        }
        return await this.pointProductRepository.update(id, entity);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }
  async remove(id: number) {
    return await this.pointProductRepository.delete(id);
  }
  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.pointProductRepository.update(id, { seq: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

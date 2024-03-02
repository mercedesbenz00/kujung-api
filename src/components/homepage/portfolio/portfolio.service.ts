import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { SearchPortfolioDto } from './dto/search-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { PortfolioImage } from './entities/portfolio-image.entity';
import { Like } from './../../like/entities/like.entity';
import { LikeEntityType, Order, ViewLogEntityType } from 'src/shared/constants';
import { ViewLogService } from '../../view-log/view-log.service';

@Injectable()
export class PortfolioService {
  constructor(
    private viewLogService: ViewLogService,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioImage)
    private portfolioImageRepository: Repository<PortfolioImage>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}
  async create(createPortfolioDto: CreatePortfolioDto) {
    try {
      const newPortfolio = new Portfolio();
      newPortfolio.title = createPortfolioDto.title;
      newPortfolio.summary = createPortfolioDto.summary;
      newPortfolio.content = createPortfolioDto.content;
      newPortfolio.category = createPortfolioDto.category;
      newPortfolio.collaboration = createPortfolioDto.collaboration;
      newPortfolio.place = createPortfolioDto.place;
      newPortfolio.online_info = createPortfolioDto.online_info;
      if (createPortfolioDto.start_at) {
        newPortfolio.start_at = new Date(createPortfolioDto.start_at);
      }
      if (createPortfolioDto.end_at) {
        newPortfolio.end_at = new Date(createPortfolioDto.end_at);
      }

      if (createPortfolioDto.portfolioImages) {
        newPortfolio.portfolioImages = [];
        for (const portfolioImage of createPortfolioDto.portfolioImages) {
          const portfolioImageEntity = new PortfolioImage();
          portfolioImageEntity.image_url = portfolioImage.image_url;
          newPortfolio.portfolioImages.push(portfolioImageEntity);
        }
      }

      return await this.portfolioRepository.save(newPortfolio);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchPortfolioDto,
    userInfo: any = null,
  ): Promise<PageDto<Portfolio>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.portfolioRepository
        .createQueryBuilder('portfolios')
        .leftJoinAndSelect('portfolios.portfolioImages', 'portfolioImages')
        .select([
          'portfolios.id',
          'portfolioImages',
          'portfolios.title',
          'portfolios.summary',
          'portfolios.content',
          'portfolios.category',
          'portfolios.collaboration',
          'portfolios.place',
          'portfolios.online_info',
          'portfolios.like_count',
          'portfolios.view_count',
          'portfolios.start_at',
          'portfolios.end_at',
          'portfolios.created_at',
          'portfolios.updated_at',
        ]);

      if (pageOptionsDto.categoryList && pageOptionsDto.categoryList.length) {
        query = query.andWhere(`portfolios.category IN (:...categoryList)`, {
          categoryList: pageOptionsDto.categoryList,
        });
      }
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(portfolios.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(`portfolios.start_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
        query = query.andWhere(`portfolios.end_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`portfolios.start_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`portfolios.end_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`portfolios.${orderBy}`, pageOptionsDto.order)
        .addOrderBy(`portfolios.id`, pageOptionsDto.order);

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
            type: LikeEntityType.Portfolio,
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
        allCount = await this.portfolioRepository.count({
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

  private getCompare(order: string, isNext = true): string {
    if (order === Order.ASC) {
      return isNext ? '>' : '<';
    } else {
      return isNext ? '<' : '>';
    }
  }

  async getNextPortfolio(
    id: number,
    pageOptionsDto: SearchPortfolioDto,
  ): Promise<Portfolio> {
    try {
      const curPortfolio = await this.findOne(id);
      if (curPortfolio) {
        const orderBy = pageOptionsDto.sortBy || 'id';
        let query = this.portfolioRepository
          .createQueryBuilder('portfolios')
          .leftJoinAndSelect('portfolios.portfolioImages', 'portfolioImages')
          .select([
            'portfolios.id',
            'portfolioImages',
            'portfolios.title',
            'portfolios.summary',
            'portfolios.content',
            'portfolios.category',
            'portfolios.collaboration',
            'portfolios.place',
            'portfolios.online_info',
            'portfolios.like_count',
            'portfolios.view_count',
            'portfolios.start_at',
            'portfolios.end_at',
            'portfolios.created_at',
            'portfolios.updated_at',
          ]);

        if (pageOptionsDto.categoryList && pageOptionsDto.categoryList.length) {
          query = query.andWhere(`portfolios.category IN (:...categoryList)`, {
            categoryList: pageOptionsDto.categoryList,
          });
        }
        if (pageOptionsDto.q !== undefined) {
          query = query.andWhere(
            `LOWER(portfolios.${
              pageOptionsDto.q_type || 'title'
            }) LIKE LOWER(:pattern)`,
            {
              pattern: `%${pageOptionsDto.q}%`,
            },
          );
        }

        if (pageOptionsDto.from && pageOptionsDto.to) {
          query = query.andWhere(`portfolios.start_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
          query = query.andWhere(`portfolios.end_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
        } else if (pageOptionsDto.from) {
          query = query.andWhere(`portfolios.start_at >= :from`, {
            from: new Date(pageOptionsDto.from),
          });
        } else if (pageOptionsDto.to) {
          query = query.andWhere(`portfolios.end_at <= :to`, {
            to: new Date(pageOptionsDto.to),
          });
        }

        let queryDuplicateList = query.clone();
        if (
          curPortfolio[orderBy] === null ||
          curPortfolio[orderBy] === undefined
        ) {
          queryDuplicateList = queryDuplicateList.andWhere(
            `portfolios.${orderBy} IS NULL`,
          );
        } else if (orderBy.includes('_at')) {
          const date1 = new Date(curPortfolio[orderBy]);
          const date2 = new Date(date1.getTime() + 1000);
          queryDuplicateList = queryDuplicateList.andWhere(
            `portfolios.${orderBy} BETWEEN :checkValue1 AND :checkValue2`,
            {
              checkValue1: date1,
              checkValue2: date2,
            },
          );
        } else {
          queryDuplicateList = queryDuplicateList.andWhere(
            `portfolios.${orderBy} = :checkValue`,
            {
              checkValue: curPortfolio[orderBy],
            },
          );
        }

        queryDuplicateList = queryDuplicateList.orderBy(
          `portfolios.${orderBy}`,
          pageOptionsDto.order,
        );
        queryDuplicateList = queryDuplicateList.addOrderBy(
          `portfolios.id`,
          pageOptionsDto.order,
        );

        const duplicatList = await queryDuplicateList.getMany();
        let nextPortfolio = null;
        if (duplicatList.length > 1) {
          for (let i = 0; i < duplicatList.length; i++) {
            if (Number(duplicatList[i].id) === id) {
              if (i < duplicatList.length - 1) {
                nextPortfolio = duplicatList[i + 1];
              }
            }
          }
        }

        if (nextPortfolio) {
          return nextPortfolio;
        }

        if (curPortfolio[orderBy]) {
          query = query.andWhere(
            `portfolios.${orderBy} ${this.getCompare(
              pageOptionsDto.order,
            )} :orderValue`,
            {
              orderValue: orderBy.includes('_at')
                ? new Date(curPortfolio[orderBy])
                : curPortfolio[orderBy],
            },
          );
        }
        query = query.andWhere(`portfolios.id != :idValue`, {
          idValue: curPortfolio.id,
        });

        query = query.orderBy(`portfolios.${orderBy}`, pageOptionsDto.order);
        query = query.addOrderBy(`portfolios.id`, pageOptionsDto.order);

        nextPortfolio = await query.getOne();

        return nextPortfolio;
      }
      return null;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPrevPortfolio(
    id: number,
    pageOptionsDto: SearchPortfolioDto,
  ): Promise<Portfolio> {
    try {
      const curPortfolio = await this.findOne(id);
      if (curPortfolio) {
        const orderBy = pageOptionsDto.sortBy || 'id';
        let query = this.portfolioRepository
          .createQueryBuilder('portfolios')
          .leftJoinAndSelect('portfolios.portfolioImages', 'portfolioImages')
          .select([
            'portfolios.id',
            'portfolioImages',
            'portfolios.title',
            'portfolios.summary',
            'portfolios.content',
            'portfolios.category',
            'portfolios.collaboration',
            'portfolios.place',
            'portfolios.online_info',
            'portfolios.like_count',
            'portfolios.view_count',
            'portfolios.start_at',
            'portfolios.end_at',
            'portfolios.created_at',
            'portfolios.updated_at',
          ]);

        if (pageOptionsDto.categoryList && pageOptionsDto.categoryList.length) {
          query = query.andWhere(`portfolios.category IN (:...categoryList)`, {
            categoryList: pageOptionsDto.categoryList,
          });
        }
        if (pageOptionsDto.q !== undefined) {
          query = query.andWhere(
            `LOWER(portfolios.${
              pageOptionsDto.q_type || 'title'
            }) LIKE LOWER(:pattern)`,
            {
              pattern: `%${pageOptionsDto.q}%`,
            },
          );
        }

        if (pageOptionsDto.from && pageOptionsDto.to) {
          query = query.andWhere(`portfolios.start_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
          query = query.andWhere(`portfolios.end_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
        } else if (pageOptionsDto.from) {
          query = query.andWhere(`portfolios.start_at >= :from`, {
            from: new Date(pageOptionsDto.from),
          });
        } else if (pageOptionsDto.to) {
          query = query.andWhere(`portfolios.end_at <= :to`, {
            to: new Date(pageOptionsDto.to),
          });
        }

        let queryDuplicateList = query.clone();
        if (
          curPortfolio[orderBy] === null ||
          curPortfolio[orderBy] === undefined
        ) {
          queryDuplicateList = queryDuplicateList.andWhere(
            `portfolios.${orderBy} IS NULL`,
          );
        } else if (orderBy.includes('_at')) {
          const date1 = new Date(curPortfolio[orderBy]);
          const date2 = new Date(date1.getTime() + 1000);
          queryDuplicateList = queryDuplicateList.andWhere(
            `portfolios.${orderBy} BETWEEN :checkValue1 AND :checkValue2`,
            {
              checkValue1: date1,
              checkValue2: date2,
            },
          );
        } else {
          queryDuplicateList = queryDuplicateList.andWhere(
            `portfolios.${orderBy} = :checkValue`,
            {
              checkValue: curPortfolio[orderBy],
            },
          );
        }

        queryDuplicateList = queryDuplicateList.orderBy(
          `portfolios.${orderBy}`,
          pageOptionsDto.order,
        );
        queryDuplicateList = queryDuplicateList.addOrderBy(
          `portfolios.id`,
          pageOptionsDto.order,
        );

        const duplicatList = await queryDuplicateList.getMany();
        let prevPortfolio = null;
        if (duplicatList.length > 1) {
          for (let i = 0; i < duplicatList.length; i++) {
            if (Number(duplicatList[i].id) === id) {
              if (i > 0) {
                prevPortfolio = duplicatList[i - 1];
              }
            }
          }
        }

        if (prevPortfolio) {
          return prevPortfolio;
        }

        if (curPortfolio[orderBy]) {
          query = query.andWhere(
            `portfolios.${orderBy} ${this.getCompare(
              pageOptionsDto.order,
              false,
            )} :orderValue`,
            {
              orderValue: orderBy.includes('_at')
                ? new Date(curPortfolio[orderBy])
                : curPortfolio[orderBy],
            },
          );
        }
        query = query.andWhere(`portfolios.id != :idValue`, {
          idValue: curPortfolio.id,
        });

        query = query.orderBy(
          `portfolios.${orderBy}`,
          pageOptionsDto.order === 'ASC' ? 'DESC' : 'ASC',
        );
        query = query.addOrderBy(
          `portfolios.id`,
          pageOptionsDto.order === 'ASC' ? 'DESC' : 'ASC',
        );
        prevPortfolio = await query.getOne();

        return prevPortfolio;
      }
      return null;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(
    id: number,
    userInfo: any = null,
    canUpdateViewCount = false,
  ): Promise<any> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: id },
      relations: {
        portfolioImages: true,
      },
    });
    if (
      portfolio &&
      canUpdateViewCount &&
      ((userInfo && userInfo.roles && userInfo.roles.includes('user')) ||
        !userInfo)
    ) {
      await this.viewLogService.updateViewLog(userInfo?.id, {
        type: ViewLogEntityType.Portfolio,
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
            type: LikeEntityType.Portfolio,
          })
          .getOne();
        portfolio.userLiked = userEntityLike ? true : false;
      }
    }
    return portfolio;
  }

  async update(id: number, updatePortfolioDto: UpdatePortfolioDto) {
    try {
      const portfolio = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updatePortfolioDto[field] !== undefined)
          portfolio[field] = updatePortfolioDto[field];
      };

      if (portfolio) {
        updateValue('title');
        updateValue('summary');
        updateValue('content');
        updateValue('category');
        updateValue('collaboration');
        updateValue('place');
        updateValue('online_info');
        if (updatePortfolioDto.start_at) {
          portfolio.start_at = new Date(updatePortfolioDto.start_at);
        }
        if (updatePortfolioDto.end_at) {
          portfolio.end_at = new Date(updatePortfolioDto.end_at);
        }

        if (updatePortfolioDto.portfolioImages) {
          if (portfolio.portfolioImages) {
            // Find the images to remove
            const imagesToRemove = portfolio.portfolioImages.filter(
              (existingImage) => {
                return !updatePortfolioDto.portfolioImages.some(
                  (newImage) => newImage.id === existingImage.id,
                );
              },
            );

            // Delete the images that are no longer associated with the entity
            if (imagesToRemove.length) {
              await this.portfolioImageRepository.remove(imagesToRemove);
            }
          }
          portfolio.portfolioImages = [];
          for (const portfolioImage of updatePortfolioDto.portfolioImages) {
            const portfolioImageEntity = new PortfolioImage();
            if (portfolioImage.id) {
              portfolioImageEntity.id = portfolioImage.id;
            }
            portfolioImageEntity.image_url = portfolioImage.image_url;
            portfolio.portfolioImages.push(portfolioImageEntity);
          }
        }
        return await this.portfolioRepository.save(portfolio);
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
      .andWhere('type = :type', { type: LikeEntityType.Portfolio })
      .execute();
    return await this.portfolioRepository.delete(id);
  }
}

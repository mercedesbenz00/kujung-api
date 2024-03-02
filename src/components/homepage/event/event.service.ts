import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SearchEventDto } from './dto/search-event.dto';
import { Event } from './entities/event.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';
import { Order } from 'src/shared/constants';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}
  async create(createEventDto: CreateEventDto) {
    try {
      const newEvent = new Event();
      newEvent.title = createEventDto.title;
      if (createEventDto.content) {
        const contentBuffer = Buffer.from(createEventDto.content, 'utf-8');
        newEvent.content = contentBuffer;
      }
      newEvent.thumb_url = createEventDto.thumb_url;
      newEvent.enabled = createEventDto.enabled;

      if (createEventDto.start_at) {
        newEvent.start_at = new Date(createEventDto.start_at);
      }
      if (createEventDto.end_at) {
        newEvent.end_at = new Date(createEventDto.end_at);
      }

      return await this.eventRepository.save(newEvent);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(pageOptionsDto: SearchEventDto): Promise<PageDto<Event>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.eventRepository
        .createQueryBuilder('events')
        .select([
          'events.id',
          'events.title',
          'events.thumb_url',
          'events.enabled',
          'events.start_at',
          'events.end_at',
          'events.created_at',
          'events.updated_at',
        ]);
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(events.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(`events.start_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
        query = query.andWhere(`events.end_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`events.start_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`events.end_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      if (pageOptionsDto.enabled !== undefined) {
        query = query.andWhere(`events.enabled = :enabled`, {
          enabled: pageOptionsDto.enabled,
        });
      }
      if (pageOptionsDto.status) {
        const currentDate = new Date();
        // const currentDateOnly = currentDate.toISOString().split('T')[0];
        // if (pageOptionsDto.status === 1) {
        //   query = query.andWhere(`DATE(events.start_at) <= :currentDate`, {
        //     currentDate: currentDateOnly,
        //   });
        //   query = query.andWhere(`DATE(events.end_at) >= :currentDate`, {
        //     currentDate: currentDateOnly,
        //   });
        // } else if (pageOptionsDto.status === 2) {
        //   query = query.andWhere(`DATE(events.start_at) >= :currentDate`, {
        //     currentDate: currentDateOnly,
        //   });
        // } else if (pageOptionsDto.status === 3) {
        //   query = query.andWhere(`DATE(events.end_at) <= :currentDate`, {
        //     currentDate: currentDateOnly,
        //   });
        // }
        if (pageOptionsDto.status === 1) {
          query = query.andWhere(`events.start_at <= :currentDate`, {
            currentDate: currentDate,
          });
          query = query.andWhere(`events.end_at >= :currentDate`, {
            currentDate: currentDate,
          });
        } else if (pageOptionsDto.status === 2) {
          query = query.andWhere(`events.start_at >= :currentDate`, {
            currentDate: currentDate,
          });
        } else if (pageOptionsDto.status === 3) {
          query = query.andWhere(`events.end_at <= :currentDate`, {
            currentDate: currentDate,
          });
        }
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`events.${orderBy}`, pageOptionsDto.order)
        .addOrderBy(`events.id`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.eventRepository.count({
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

  async getNextEvent(
    id: number,
    pageOptionsDto: SearchEventDto,
  ): Promise<Event> {
    try {
      const curEvent = await this.findOne(id);
      if (curEvent) {
        const orderBy = pageOptionsDto.sortBy || 'id';
        let query = this.eventRepository
          .createQueryBuilder('events')
          .select([
            'events.id',
            'events.title',
            'events.thumb_url',
            'events.enabled',
            'events.start_at',
            'events.end_at',
            'events.created_at',
            'events.updated_at',
          ]);
        if (pageOptionsDto.q !== undefined) {
          query = query.andWhere(
            `LOWER(events.${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
            {
              pattern: `%${pageOptionsDto.q}%`,
            },
          );
        }

        if (pageOptionsDto.from && pageOptionsDto.to) {
          query = query.andWhere(`events.start_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
          query = query.andWhere(`events.end_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
        } else if (pageOptionsDto.from) {
          query = query.andWhere(`events.start_at >= :from`, {
            from: new Date(pageOptionsDto.from),
          });
        } else if (pageOptionsDto.to) {
          query = query.andWhere(`events.end_at <= :to`, {
            to: new Date(pageOptionsDto.to),
          });
        }

        if (pageOptionsDto.enabled !== undefined) {
          query = query.andWhere(`events.enabled = :enabled`, {
            enabled: pageOptionsDto.enabled,
          });
        }
        if (pageOptionsDto.status) {
          const currentDate = new Date();
          if (pageOptionsDto.status === 1) {
            query = query.andWhere(`events.start_at <= :currentDate`, {
              currentDate: currentDate,
            });
            query = query.andWhere(`events.end_at >= :currentDate`, {
              currentDate: currentDate,
            });
          } else if (pageOptionsDto.status === 2) {
            query = query.andWhere(`events.start_at >= :currentDate`, {
              currentDate: currentDate,
            });
          } else if (pageOptionsDto.status === 3) {
            query = query.andWhere(`events.end_at <= :currentDate`, {
              currentDate: currentDate,
            });
          }
        }

        let queryDuplicateList = query.clone();
        if (curEvent[orderBy] === null || curEvent[orderBy] === undefined) {
          queryDuplicateList = queryDuplicateList.andWhere(
            `events.${orderBy} IS NULL`,
          );
        } else if (orderBy.includes('_at')) {
          const date1 = new Date(curEvent[orderBy]);
          const date2 = new Date(date1.getTime() + 1000);
          queryDuplicateList = queryDuplicateList.andWhere(
            `events.${orderBy} BETWEEN :checkValue1 AND :checkValue2`,
            {
              checkValue1: date1,
              checkValue2: date2,
            },
          );
        } else {
          queryDuplicateList = queryDuplicateList.andWhere(
            `events.${orderBy} = :checkValue`,
            {
              checkValue: curEvent[orderBy],
            },
          );
        }

        queryDuplicateList = queryDuplicateList.orderBy(
          `events.${orderBy}`,
          pageOptionsDto.order,
        );
        queryDuplicateList = queryDuplicateList.addOrderBy(
          `events.id`,
          pageOptionsDto.order,
        );

        const duplicatList = await queryDuplicateList.getMany();
        let nextEvent = null;
        if (duplicatList.length > 1) {
          for (let i = 0; i < duplicatList.length; i++) {
            if (Number(duplicatList[i].id) === id) {
              if (i < duplicatList.length - 1) {
                nextEvent = duplicatList[i + 1];
              }
            }
          }
        }

        if (nextEvent) {
          return nextEvent;
        }

        if (curEvent[orderBy]) {
          query = query.andWhere(
            `events.${orderBy} ${this.getCompare(
              pageOptionsDto.order,
            )} :orderValue`,
            {
              orderValue: orderBy.includes('_at')
                ? new Date(curEvent[orderBy])
                : curEvent[orderBy],
            },
          );
        }
        query = query.andWhere(`events.id != :idValue`, {
          idValue: curEvent.id,
        });

        query = query.orderBy(`events.${orderBy}`, pageOptionsDto.order);
        query = query.addOrderBy(`events.id`, pageOptionsDto.order);

        nextEvent = await query.getOne();

        return nextEvent;
      }
      return null;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPrevEvent(
    id: number,
    pageOptionsDto: SearchEventDto,
  ): Promise<Event> {
    try {
      const curEvent = await this.findOne(id);
      if (curEvent) {
        const orderBy = pageOptionsDto.sortBy || 'id';
        let query = this.eventRepository
          .createQueryBuilder('events')
          .select([
            'events.id',
            'events.title',
            'events.thumb_url',
            'events.enabled',
            'events.start_at',
            'events.end_at',
            'events.created_at',
            'events.updated_at',
          ]);
        if (pageOptionsDto.q !== undefined) {
          query = query.andWhere(
            `LOWER(events.${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
            {
              pattern: `%${pageOptionsDto.q}%`,
            },
          );
        }

        if (pageOptionsDto.from && pageOptionsDto.to) {
          query = query.andWhere(`events.start_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
          query = query.andWhere(`events.end_at BETWEEN :from AND :to`, {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          });
        } else if (pageOptionsDto.from) {
          query = query.andWhere(`events.start_at >= :from`, {
            from: new Date(pageOptionsDto.from),
          });
        } else if (pageOptionsDto.to) {
          query = query.andWhere(`events.end_at <= :to`, {
            to: new Date(pageOptionsDto.to),
          });
        }

        if (pageOptionsDto.enabled !== undefined) {
          query = query.andWhere(`events.enabled = :enabled`, {
            enabled: pageOptionsDto.enabled,
          });
        }
        if (pageOptionsDto.status) {
          const currentDate = new Date();
          if (pageOptionsDto.status === 1) {
            query = query.andWhere(`events.start_at <= :currentDate`, {
              currentDate: currentDate,
            });
            query = query.andWhere(`events.end_at >= :currentDate`, {
              currentDate: currentDate,
            });
          } else if (pageOptionsDto.status === 2) {
            query = query.andWhere(`events.start_at >= :currentDate`, {
              currentDate: currentDate,
            });
          } else if (pageOptionsDto.status === 3) {
            query = query.andWhere(`events.end_at <= :currentDate`, {
              currentDate: currentDate,
            });
          }
        }

        let queryDuplicateList = query.clone();
        if (curEvent[orderBy] === null || curEvent[orderBy] === undefined) {
          queryDuplicateList = queryDuplicateList.andWhere(
            `events.${orderBy} IS NULL`,
          );
        } else if (orderBy.includes('_at')) {
          const date1 = new Date(curEvent[orderBy]);
          const date2 = new Date(date1.getTime() + 1000);
          queryDuplicateList = queryDuplicateList.andWhere(
            `events.${orderBy} BETWEEN :checkValue1 AND :checkValue2`,
            {
              checkValue1: date1,
              checkValue2: date2,
            },
          );
        } else {
          queryDuplicateList = queryDuplicateList.andWhere(
            `events.${orderBy} = :checkValue`,
            {
              checkValue: curEvent[orderBy],
            },
          );
        }

        queryDuplicateList = queryDuplicateList.orderBy(
          `events.${orderBy}`,
          pageOptionsDto.order,
        );
        queryDuplicateList = queryDuplicateList.addOrderBy(
          `events.id`,
          pageOptionsDto.order,
        );

        const duplicatList = await queryDuplicateList.getMany();
        let prevEvent = null;
        if (duplicatList.length > 1) {
          for (let i = 0; i < duplicatList.length; i++) {
            if (Number(duplicatList[i].id) === id) {
              if (i > 0) {
                prevEvent = duplicatList[i - 1];
              }
            }
          }
        }

        if (prevEvent) {
          return prevEvent;
        }

        if (curEvent[orderBy]) {
          query = query.andWhere(
            `events.${orderBy} ${this.getCompare(
              pageOptionsDto.order,
              false,
            )} :orderValue`,
            {
              orderValue: orderBy.includes('_at')
                ? new Date(curEvent[orderBy])
                : curEvent[orderBy],
            },
          );
        }
        query = query.andWhere(`events.id != :idValue`, {
          idValue: curEvent.id,
        });

        query = query.orderBy(
          `events.${orderBy}`,
          pageOptionsDto.order === 'ASC' ? 'DESC' : 'ASC',
        );
        query = query.addOrderBy(
          `events.id`,
          pageOptionsDto.order === 'ASC' ? 'DESC' : 'ASC',
        );

        prevEvent = await query.getOne();

        return prevEvent;
      }
      return null;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number, needConvert = false): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id: id },
    });
    if (needConvert && event && event.content) {
      const contentString = event.content?.toString('utf-8');
      return { ...event, content: contentString };
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateEventDto[field] !== undefined)
          event[field] = updateEventDto[field];
      };

      if (event) {
        updateValue('title');
        updateValue('thumb_url');
        updateValue('enabled');
        if (updateEventDto.start_at) {
          event.start_at = new Date(updateEventDto.start_at);
        }
        if (updateEventDto.end_at) {
          event.end_at = new Date(updateEventDto.end_at);
        }
        if (updateEventDto.content) {
          const contentBuffer = Buffer.from(updateEventDto.content, 'utf-8');
          event.content = contentBuffer;
        }
        return await this.eventRepository.save(event);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.eventRepository.delete(id);
  }
}

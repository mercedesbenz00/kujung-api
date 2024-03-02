import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { SearchFaqDto } from './dto/search-faq.dto';
import { Faq } from './entities/faq.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}
  async create(createFaqDto: CreateFaqDto) {
    try {
      const newFaq = new Faq();
      newFaq.question = createFaqDto.question;
      newFaq.answer = createFaqDto.answer;

      return await this.faqRepository.save(newFaq);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(pageOptionsDto: SearchFaqDto): Promise<PageDto<Faq>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.faqRepository
        .createQueryBuilder('faqs')
        .select([
          'faqs.id',
          'faqs.question',
          'faqs.answer',
          'faqs.created_at',
          'faqs.updated_at',
        ]);
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(faqs.${
            pageOptionsDto.q_type || 'question'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(`faqs.created_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`faqs.created_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`faqs.created_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`faqs.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.faqRepository.count({
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

  async findOne(id: number): Promise<any> {
    const faq = await this.faqRepository.findOne({
      where: { id: id },
    });
    return faq;
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    try {
      const faq = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateFaqDto[field] !== undefined) faq[field] = updateFaqDto[field];
      };

      if (faq) {
        updateValue('question');
        updateValue('answer');
        return await this.faqRepository.save(faq);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.faqRepository.delete(id);
  }
}

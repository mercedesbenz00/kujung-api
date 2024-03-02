import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { SearchCertificationDto } from './dto/search-certification.dto';
import { Certification } from './entities/certification.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';
import { PageDto, PageMetaDto } from '../../../shared/dtos';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private certificationRepository: Repository<Certification>,
  ) {}
  async create(createCertificationDto: CreateCertificationDto) {
    try {
      const newCertification = new Certification();
      if (createCertificationDto.certification_type_code !== undefined) {
        newCertification.certification_type_info = new CommonConstant();
        newCertification.certification_type_info.id =
          createCertificationDto.certification_type_code;
      }
      newCertification.title = createCertificationDto.title;
      newCertification.variety = createCertificationDto.variety;
      newCertification.product_name = createCertificationDto.product_name;
      newCertification.authority = createCertificationDto.authority;
      newCertification.attachment_file = createCertificationDto.attachment_file;
      newCertification.thumb_url = createCertificationDto.thumb_url;
      newCertification.thumb_url_mobile =
        createCertificationDto.thumb_url_mobile;
      if (createCertificationDto.start_at) {
        newCertification.start_at = new Date(createCertificationDto.start_at);
      }
      if (createCertificationDto.end_at) {
        newCertification.end_at = new Date(createCertificationDto.end_at);
      }

      return await this.certificationRepository.save(newCertification);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchCertificationDto,
  ): Promise<PageDto<Certification>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.certificationRepository
        .createQueryBuilder('certifications')
        .leftJoinAndSelect(
          'certifications.certification_type_info',
          'certification_type_info',
        )
        .select([
          'certifications.id',
          'certification_type_info',
          'certifications.title',
          'certifications.variety',
          'certifications.product_name',
          'certifications.authority',
          'certifications.attachment_file',
          'certifications.thumb_url',
          'certifications.thumb_url_mobile',
          'certifications.start_at',
          'certifications.end_at',
          'certifications.updated_at',
        ]);

      if (
        pageOptionsDto.certification_type_list &&
        pageOptionsDto.certification_type_list.length
      ) {
        query = query.andWhere(
          `certification_type_info.id IN (:...certification_type_list)`,
          {
            certification_type_list: pageOptionsDto.certification_type_list,
          },
        );
      }
      if (pageOptionsDto.q !== undefined) {
        query = query.andWhere(
          `LOWER(certifications.${
            pageOptionsDto.q_type || 'title'
          }) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }

      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `certifications.start_at BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
        query = query.andWhere(`certifications.end_at BETWEEN :from AND :to`, {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        });
      } else if (pageOptionsDto.from) {
        query = query.andWhere(`certifications.start_at >= :from`, {
          from: new Date(pageOptionsDto.from),
        });
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`certifications.end_at <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`certifications.${orderBy}`, pageOptionsDto.order);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;

      const whereGlobalCondition: any = {};

      if (pageOptionsDto.needAllCount) {
        allCount = await this.certificationRepository.count({
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
    const certification = await this.certificationRepository.findOne({
      where: { id: id },
      relations: {
        certification_type_info: true,
      },
    });
    return certification;
  }

  async update(id: number, updateCertificationDto: UpdateCertificationDto) {
    try {
      const certification = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateCertificationDto[field] !== undefined)
          certification[field] = updateCertificationDto[field];
      };

      if (certification) {
        updateValue('title');
        updateValue('variety');
        updateValue('product_name');
        updateValue('authority');
        updateValue('attachment_file');
        updateValue('thumb_url');
        updateValue('thumb_url_mobile');
        if (updateCertificationDto.start_at) {
          certification.start_at = new Date(updateCertificationDto.start_at);
        }
        if (updateCertificationDto.end_at) {
          certification.end_at = new Date(updateCertificationDto.end_at);
        }
        if (updateCertificationDto.certification_type_code !== undefined) {
          certification.certification_type_info = new CommonConstant();
          certification.certification_type_info.id =
            updateCertificationDto.certification_type_code;
        }
        return await this.certificationRepository.save(certification);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.certificationRepository.delete(id);
  }
}

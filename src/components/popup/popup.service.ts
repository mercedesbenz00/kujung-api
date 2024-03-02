import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';
import { Popup } from './entities/popup.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { SearchPopupDto } from './dto/search-popup.dto';

@Injectable()
export class PopupService {
  constructor(
    @InjectRepository(Popup)
    private popupRepository: Repository<Popup>,
  ) {}
  async create(createPopupDto: CreatePopupDto) {
    try {
      return await this.popupRepository.save(createPopupDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(pageOptionsDto: SearchPopupDto): Promise<PageDto<Popup>> {
    const queryBuilder = this.popupRepository.createQueryBuilder('popups');

    if (pageOptionsDto.enabled !== undefined) {
      queryBuilder.where('enabled = :enabled', {
        enabled: pageOptionsDto.enabled,
      });
    }
    queryBuilder
      .orderBy(
        !!pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'priority',
        pageOptionsDto.order,
      )
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
    // return this.popupRepository.find();
  }

  findOne(id: number): Promise<Popup> {
    return this.popupRepository.findOneBy({ id: id });
  }

  async update(id: number, updatePopupDto: UpdatePopupDto) {
    try {
      const popup = await this.findOne(id);

      if (popup) {
        return await this.popupRepository.update(id, updatePopupDto);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.popupRepository.delete(id);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { FindManyOptions, ILike, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateAdminDto } from './dto/create-admin.dto';
import { SearchAdminDto } from './dto/search-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { Menu } from '../menu/entities/menu.entity';
import { Order } from '../../shared/constants';
import { PageDto, PageMetaDto } from '../../shared/dtos';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async getItemList(pageOptionsDto: SearchAdminDto): Promise<PageDto<Admin>> {
    const whereCondition: any = {};

    const sqlQueryInfo: FindManyOptions = {
      order: {
        [pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'created_at']:
          pageOptionsDto.order,
        updated_at: Order.DESC,
      },
      select: [
        'id',
        'name',
        'user_id',
        'email',
        'nickname',
        'phone',
        'gender',
        'disabled',
      ],
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    };
    if (pageOptionsDto.disabled !== undefined) {
      whereCondition.disabled = pageOptionsDto.disabled;
    }
    const whereGlobalCondition: any = { ...whereCondition };
    if (pageOptionsDto.q) {
      const queryType = pageOptionsDto.q_type || 'name';

      whereCondition[queryType] = ILike(`%${pageOptionsDto.q}%`);
    }

    if (Object.keys(whereCondition).length) {
      sqlQueryInfo.where = whereCondition;
    }
    const [entities, totalCount] = await this.adminRepository.findAndCount(
      sqlQueryInfo,
    );
    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.adminRepository.count({
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

  async findOne(data: any): Promise<Admin | undefined> {
    // return await this.adminRepository.findOneBy(data);
    return await this.adminRepository.findOne({
      where: data,
    });
  }

  async findOneWithPermissions(id: number): Promise<Admin | undefined> {
    // return await this.adminRepository.findOneBy(data);
    return await this.adminRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'name',
        'user_id',
        'email',
        'nickname',
        'phone',
        'gender',
        'disabled',
        'permissions',
      ],
      relations: {
        permissions: true,
      },
    });
  }

  async checkDuplication(
    id: number,
    email: string,
    nickname: string,
    user_id: string,
  ) {
    const whereConditions = [];
    if (email) {
      if (id === undefined || id === null) {
        whereConditions.push({ email: email });
      } else {
        whereConditions.push({ email: email, id: Not(id) });
      }
    }
    if (nickname) {
      if (id === undefined || id === null) {
        whereConditions.push({ nickname: nickname });
      } else {
        whereConditions.push({ nickname: nickname, id: Not(id) });
      }
    }

    if (user_id) {
      if (id === undefined || id === null) {
        whereConditions.push({ user_id: user_id });
      } else {
        whereConditions.push({ user_id: user_id, id: Not(id) });
      }
    }

    if (whereConditions.length === 0) {
      return false;
    }
    const user = await this.findOne(whereConditions);
    if (user) {
      return true;
    }
    return false;
  }

  async create(data: CreateAdminDto) {
    try {
      const isDuplicate = await this.checkDuplication(
        null,
        data.email,
        data.nickname,
        data.user_id,
      );
      if (isDuplicate) {
        throw new HttpException(
          '이미 등록된 관리자가 존재합니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (data.password?.length) {
        data.password = await bcrypt.hashSync(data.password, 10);
      }
      const admin: Admin = await this.adminRepository.create({
        name: data.name,
        user_id: data.user_id,
        email: data.email,
        password: data.password,
        phone: data.phone,
        nickname: data.nickname,
        disabled: data.disabled,
        gender: data.gender,
      });

      if (data.permissions) {
        admin.permissions = [];
        for (const permission of data.permissions) {
          const menuEntity = new Menu();
          menuEntity.id = permission.id;
          admin.permissions.push(menuEntity);
        }
      }
      return await this.adminRepository.save(admin).then((res) => res);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const isDuplicate = await this.checkDuplication(
        id,
        updateAdminDto.email,
        updateAdminDto.nickname,
        updateAdminDto.user_id,
      );
      if (isDuplicate) {
        throw new HttpException(
          '이미 등록된 정보입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.findOne({ id });
      const updateValue = (field: string) => {
        if (updateAdminDto[field] !== undefined)
          user[field] = updateAdminDto[field];
      };

      if (user) {
        updateValue('name');
        updateValue('user_id');
        updateValue('email');
        updateValue('phone');
        updateValue('nickname');
        updateValue('gender');
        updateValue('disabled');
        if (updateAdminDto.password?.length) {
          user.password = await bcrypt.hashSync(updateAdminDto.password, 10);
        }

        if (updateAdminDto.permissions) {
          user.permissions = [];
          for (const permission of updateAdminDto.permissions) {
            const menuEntity = new Menu();
            menuEntity.id = permission.id;
            user.permissions.push(menuEntity);
          }
        }
        return await this.adminRepository.save(user);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.adminRepository.delete(id);
  }
}

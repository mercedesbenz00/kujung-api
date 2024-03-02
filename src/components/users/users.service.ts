import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  ILike,
  Between,
  LessThan,
  MoreThan,
  Not,
  In,
} from 'typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { DailyLimit } from './entities/daily-limit.entity';
import { Like } from './../like/entities/like.entity';
import { ResetPasswordToken } from './entities/reset-password-token.entity';
import { CommonConstant } from '../common-constant/entities/common-constant.entity';

import { CreateBusinessDto } from './dto/create-business.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { RemoveUserAccountDto } from './dto/remove-user-account.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Order, UserStatus } from '../../shared/constants';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { ProfileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LikeEntityType } from 'src/shared/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(DailyLimit)
    private dailyLimitRepository: Repository<DailyLimit>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(ResetPasswordToken)
    private resetPasswordTokenRepository: Repository<ResetPasswordToken>,
  ) {}

  async checkBusinessNumberValidity(
    userId: number,
    businessNumber: string,
  ): Promise<boolean> {
    try {
      const businessNum = businessNumber.replace(/-/g, '');
      const response = await axios.post(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${process.env.OPEN_API_KEY}`,
        {
          b_no: [businessNum],
        },
      );
      // console.log('response', response.data);
      const isValid = response.data.data[0].b_stt !== '';
      if (isValid) {
        // check duplication
        const isDuplicate = await this.checkDuplication(
          userId,
          null,
          null,
          null,
          businessNumber,
        );
        if (isDuplicate) {
          throw new HttpException(
            '중복된 사업자번호입니다.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      return isValid;
    } catch (error) {
      console.error('Error while checking business number validity:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(
    data: any,
    userInfo: any = null,
    canUpdateViewCount = false,
  ): Promise<User | undefined> {
    // return await this.usersRepository.findOneBy(data);
    const user = await this.usersRepository.findOne({
      where: data,
      relations: {
        profile: {
          age_range_info: true,
          color_info: true,
          area_space_info: true,
          house_type_info: true,
          family_type_info: true,
          house_styles: true,
          interior_feeling_info: true,
        },
        roles: true,
      },
    });

    if (
      user &&
      canUpdateViewCount &&
      ((userInfo && userInfo.roles && userInfo.roles.includes('user')) ||
        !userInfo)
    ) {
      if (userInfo) {
        const userEntityLike = await this.likeRepository
          .createQueryBuilder('like_items')
          .where('like_items.entity_id = :entity_id', {
            entity_id: user.id,
          })
          .andWhere(`like_items.user_id = :user_id`, {
            user_id: userInfo.id,
          })
          .andWhere(`like_items.type = :type`, {
            type: LikeEntityType.User,
          })
          .getOne();
        user.userLiked = userEntityLike ? true : false;
      }
    }

    return user;
  }

  async getUserInfo(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({
      id: id,
    });
  }

  async createFromSocial(data: any) {
    const user: User = await this.usersRepository.create({
      name: data.name,
      user_id: data.user_id,
      email: data.email,
      password: '',
      phone: data.phone,
      nickname: data.nickname,
      allow_sms_recv: true,
      allow_email_recv: true,
      status: UserStatus.ACTIVE,
      approved_at: new Date(),
    });

    const profile: Profile = this.composeProfile(data.profile);

    user.profile = await this.profileRepository.save(profile);
    return await this.usersRepository.save(user).then((res) => res);
  }

  async create(data: CreateUserDto) {
    const user: User = await this.usersRepository.create({
      name: data.name,
      user_id: data.user_id,
      email: data.email,
      password: data.password,
      phone: data.phone,
      nickname: data.nickname,
      addr: data.addr,
      addr_sub: data.addr_sub,
      zonecode: data.zonecode,
      allow_sms_recv: data.allow_sms_recv,
      allow_email_recv: data.allow_email_recv,
      status: UserStatus.ACTIVE,
      approved_at: new Date(),
    });

    const profile: Profile = this.composeProfile(data.profile);

    user.profile = await this.profileRepository.save(profile);
    return await this.usersRepository.save(user).then((res) => res);
  }

  private composeProfile(
    data: ProfileDto | UpdateProfileDto,
  ): Profile | undefined {
    if (data) {
      const profile: Profile = new Profile();
      if (data.gender !== undefined) {
        profile.gender = data.gender;
      }
      if (data.join_reason !== undefined) {
        profile.join_reason = data.join_reason;
      }
      if (data.show_private_privacy !== undefined) {
        profile.show_private_privacy = data.show_private_privacy;
      }
      if (data.photo !== undefined) {
        profile.photo = data.photo;
      }
      if (data?.age_range_code !== undefined) {
        profile.age_range_info = new CommonConstant();
        profile.age_range_info.id = data.age_range_code;
      }
      if (data?.color_code !== undefined) {
        profile.color_info = new CommonConstant();
        profile.color_info.id = data.color_code;
      }
      if (data?.area_space_code !== undefined) {
        profile.area_space_info = new CommonConstant();
        profile.area_space_info.id = data.area_space_code;
      }
      if (data?.house_type_code !== undefined) {
        profile.house_type_info = new CommonConstant();
        profile.house_type_info.id = data.house_type_code;
      }
      if (data?.family_type_code !== undefined) {
        profile.family_type_info = new CommonConstant();
        profile.family_type_info.id = data.family_type_code;
      }
      if (data?.interior_feeling_code !== undefined) {
        profile.interior_feeling_info = new CommonConstant();
        profile.interior_feeling_info.id = data.interior_feeling_code;
      }
      if (data?.house_styles) {
        profile.house_styles = [];
        for (const houseStyle of data.house_styles) {
          const houseStyleEntity = new CommonConstant();
          houseStyleEntity.id = houseStyle.id;
          profile.house_styles.push(houseStyleEntity);
        }
      }
      return profile;
    }
    return undefined;
  }

  async createBusiness(data: CreateBusinessDto) {
    const user: User = await this.usersRepository.create({
      name: data.name,
      user_id: data.user_id,
      email: data.email,
      password: data.password,
      phone: data.phone,
      nickname: data.nickname,
      addr: data.addr,
      addr_sub: data.addr_sub,
      zonecode: data.zonecode,
      allow_sms_recv: data.allow_sms_recv,
      allow_email_recv: data.allow_email_recv,
      account_type: 'business',
      business_type: data.business_type,
      business_reg_num: data.business_reg_num,
      company_name: data.company_name,
      manager_type: data.manager_type,
      contact_name: data.contact_name,
      company_phone: data.company_phone,
      brand: data.brand,
      status: UserStatus.WAITING_APPROVAL,
    });
    if (!data.brand) {
      user.brand = data.company_name;
    }

    const profile: Profile = this.composeProfile(data.profile);
    user.profile = await this.profileRepository.save(profile);
    return await this.usersRepository.save(user).then((res) => res);
  }

  async getItemList(
    pageOptionsDto: SearchUserDto,
    userInfo: any = null,
  ): Promise<PageDto<User>> {
    const whereCondition: any = {};

    const sqlQueryInfo: FindManyOptions = {
      order: {
        [pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'created_at']:
          pageOptionsDto.order,
        updated_at: Order.DESC,
      },
      relations: {
        profile: true,
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    };
    if (pageOptionsDto.status !== undefined) {
      whereCondition.status = pageOptionsDto.status;
    }
    if (pageOptionsDto.account_type !== undefined) {
      whereCondition.account_type = pageOptionsDto.account_type;
    }
    const whereGlobalCondition: any = { ...whereCondition };

    if (pageOptionsDto.manager_type !== undefined) {
      whereCondition.manager_type = pageOptionsDto.manager_type;
    }

    if (pageOptionsDto.q) {
      const queryType = pageOptionsDto.q_type || 'name';

      whereCondition[queryType] = ILike(`%${pageOptionsDto.q}%`);
    }

    const queryDateType = pageOptionsDto.date_type || 'created_at';
    if (pageOptionsDto.from && pageOptionsDto.to) {
      whereCondition[queryDateType] = Between(
        new Date(pageOptionsDto.from),
        new Date(pageOptionsDto.to),
      );
    } else if (pageOptionsDto.from) {
      whereCondition[queryDateType] = MoreThan(new Date(pageOptionsDto.from));
    } else if (pageOptionsDto.to) {
      whereCondition[queryDateType] = LessThan(new Date(pageOptionsDto.to));
    }
    if (Object.keys(whereCondition).length) {
      sqlQueryInfo.where = whereCondition;
    }
    const [entities, totalCount] = await this.usersRepository.findAndCount(
      sqlQueryInfo,
    );

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
          type: LikeEntityType.User,
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
    if (pageOptionsDto.needAllCount) {
      allCount = await this.usersRepository.count({
        where: whereGlobalCondition,
      });
    }
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(entities, pageMetaDto);
    // return this.userRepository.find();
  }

  async checkDuplication(
    id: number,
    email: string,
    nickname: string,
    user_id: string,
    business_reg_num: string,
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

    if (business_reg_num) {
      if (id === undefined || id === null) {
        whereConditions.push({ business_reg_num: business_reg_num });
      } else {
        whereConditions.push({
          business_reg_num: business_reg_num,
          id: Not(id),
        });
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

  async updatePoint(id: number, amount = 1): Promise<any> {
    try {
      const queryBuilder = this.usersRepository.createQueryBuilder('users');

      const updateResult = await queryBuilder
        .update(User)
        .set({ point: () => `point + ${amount}` })
        .where('id = :entityId', { entityId: id })
        .execute();
      return updateResult.affected > 0;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const isDuplicate = await this.checkDuplication(
        id,
        updateUserDto.email,
        updateUserDto.nickname,
        updateUserDto.user_id,
        null,
      );
      if (isDuplicate) {
        throw new HttpException(
          '이미 등록된 회원이 존재합니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.findOne({ id });
      const updateValue = (field: string) => {
        if (updateUserDto[field] !== undefined)
          user[field] = updateUserDto[field];
      };

      if (user) {
        updateValue('name');
        updateValue('user_id');
        updateValue('email');
        updateValue('phone');
        updateValue('nickname');
        updateValue('addr');
        updateValue('addr_sub');
        updateValue('zonecode');
        updateValue('allow_sms_recv');
        updateValue('allow_email_recv');
        if (updateUserDto.password?.length) {
          user.password = await bcrypt.hashSync(updateUserDto.password, 10);
        }
        const newProfile = this.composeProfile(updateUserDto.profile);
        if (newProfile) {
          const profile = { ...user.profile, ...newProfile };
          await this.profileRepository.save(profile);
          user.profile = profile;
        }
        return await this.usersRepository.save(user);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async updateBusiness(id: number, updateUserDto: UpdateBusinessDto) {
    try {
      const isDuplicate = await this.checkDuplication(
        id,
        updateUserDto.email,
        updateUserDto.nickname,
        updateUserDto.user_id,
        updateUserDto.business_reg_num,
      );
      if (isDuplicate) {
        throw new HttpException(
          '이미 등록된 회원이 존재합니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.findOne({ id });
      const updateValue = (field: string) => {
        if (updateUserDto[field] !== undefined)
          user[field] = updateUserDto[field];
      };

      if (user) {
        updateValue('name');
        updateValue('email');
        updateValue('user_id');
        updateValue('phone');
        updateValue('nickname');
        updateValue('addr');
        updateValue('addr_sub');
        updateValue('zonecode');
        updateValue('allow_sms_recv');
        updateValue('allow_email_recv');
        updateValue('business_reg_num');
        updateValue('company_name');
        updateValue('manager_type');
        updateValue('contact_name');
        updateValue('business_type');
        updateValue('company_phone');
        updateValue('brand');
        if (!user.brand) {
          user.brand = user.company_name;
        }
        if (updateUserDto.password?.length) {
          user.password = await bcrypt.hashSync(updateUserDto.password, 10);
        }
        const newProfile = this.composeProfile(updateUserDto.profile);
        if (newProfile) {
          const profile = { ...user.profile, ...newProfile };
          await this.profileRepository.save(profile);
          user.profile = profile;
        }
        return await this.usersRepository.save(user);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async updateStatusMultiple(statusDto: UpdateUserStatusDto) {
    const updateData: any = {};
    updateData.status = statusDto.status;
    if (statusDto.status == UserStatus.ACTIVE) {
      updateData.approved_at = new Date();
    } else if (statusDto.status == UserStatus.IDLE) {
      updateData.idle_at = new Date();
    } else if (statusDto.status == UserStatus.INACTIVE) {
      updateData.inactive_at = new Date();
      updateData.inactive_by_admin = true;
    }
    if (statusDto.inactive_reason !== undefined) {
      updateData.inactive_reason = statusDto.inactive_reason;
    }
    if (statusDto.inactive_reason_desc !== undefined) {
      updateData.inactive_reason_desc = statusDto.inactive_reason_desc;
    }

    return await this.usersRepository.update(
      {
        id: In(statusDto.ids),
      },
      updateData,
    );
  }

  async removeUserAccount(userId: number, statusDto: RemoveUserAccountDto) {
    const updateData: any = {};
    updateData.status = UserStatus.INACTIVE;
    updateData.inactive_at = new Date();
    updateData.inactive_by_admin = false;
    if (statusDto.inactive_reason !== undefined) {
      updateData.inactive_reason = statusDto.inactive_reason;
    }
    if (statusDto.inactive_reason_desc !== undefined) {
      updateData.inactive_reason_desc = statusDto.inactive_reason_desc;
    }

    return await this.usersRepository.update(
      {
        id: userId,
      },
      updateData,
    );
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const updateData: any = {};

    const user = await this.getUserInfo(userId);
    if (!user) {
      throw new HttpException(
        '사용자가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!bcrypt.compareSync(changePasswordDto.cur_password, user.password)) {
      throw new HttpException(
        '현존 비번이 정확치 않습니다.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    if (changePasswordDto.new_password?.length) {
      updateData.password = await bcrypt.hashSync(
        changePasswordDto.new_password,
        10,
      );
    }

    return await this.usersRepository.update(
      {
        id: userId,
      },
      updateData,
    );
  }

  async remove(id: number) {
    await this.likeRepository
      .createQueryBuilder()
      .delete()
      .from(Like)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: LikeEntityType.User })
      .execute();
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['profile'],
    });
    if (user) {
      return await this.usersRepository.remove(user);
    }
    // return await this.usersRepository.delete(id);
  }

  async updateDailyLimitCount(
    id: number,
    actionName: string,
    count: number,
  ): Promise<void> {
    // Check if a daily limit record exists
    let dailyLimit = await this.dailyLimitRepository.findOne({
      where: { user: { id: id } },
    });

    if (!dailyLimit) {
      // If no record exists, create a new one
      dailyLimit = this.dailyLimitRepository.create({
        [actionName]: count,
        user: { id: id },
      });
    } else {
      // If a record exists, increment the count
      dailyLimit[actionName] += count;
    }

    // Save the updated or new daily limit record
    if (dailyLimit[actionName] >= 0) {
      await this.dailyLimitRepository.save(dailyLimit);
    }
  }

  async getDailyLimitCount(id: number): Promise<DailyLimit> {
    const dailyLimit = await this.dailyLimitRepository.findOne({
      where: { user: { id: id } },
    });
    return dailyLimit;
  }

  async resetDailyLimitCount(): Promise<void> {
    await this.dailyLimitRepository
      .createQueryBuilder()
      .update(DailyLimit)
      .set({
        expert_house_count: 0,
        online_house_count: 0,
      })
      .execute();
  }

  async getTempPasswordInfo(userId: number) {
    return await this.resetPasswordTokenRepository.findOneBy({
      user: {
        id: userId,
      },
    });
  }

  async updateTempPasswordUseFlag(userId: number, used: boolean) {
    const info = await this.getTempPasswordInfo(userId);
    if (info) {
      info.used = used;
      await this.resetPasswordTokenRepository.save(info);
    }
  }

  async createResetPasswordToken(user: User, temp_password: string) {
    let tokenEntity = await this.resetPasswordTokenRepository.findOneBy({
      user: {
        id: user.id,
      },
    });
    if (!tokenEntity) {
      tokenEntity = new ResetPasswordToken();
      tokenEntity.user = user;
    } else {
      tokenEntity.created_at = new Date();
      tokenEntity.used = false;
    }
    tokenEntity.temp_password = temp_password;
    await this.resetPasswordTokenRepository.save(tokenEntity);
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: 'hiworks',
      host: 'smtps.hiworks.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return info.response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

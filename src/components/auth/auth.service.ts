import {
  HttpException,
  HttpStatus,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios, { AxiosRequestConfig } from 'axios';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateBusinessDto } from '../users/dto/create-business.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { UpdateBusinessDto } from '../users/dto/update-business.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { IamportAuthDto } from './dto/iamport-auth.dto';
import { PointLogService } from '../point-log/point-log.service';
import { SmsDeliveryService } from '../sms-delivery/sms-delivery.service';
import { PointType } from '../../shared/constants';
import { FindIdDto } from './dto/find-id.dto';

@Injectable()
export class AuthService {
  private readonly impKey = '7163536827255651'; // Imp REST API key
  private readonly impSecret =
    'csRuHUwnGlhheQLDm2jTeddUfGdMK5GLStEhWw1LBOHn5pCsC4zMoaQxUzmx9e85zEdRojNRM7YZ0HRS'; // Imp REST API secret

  async getIamportToken(): Promise<string> {
    const response = await axios.post(
      'https://api.iamport.kr/users/getToken/',
      {
        imp_key: this.impKey,
        imp_secret: this.impSecret,
      },
    );
    const { access_token } = response.data.response;
    return access_token;
  }

  async getIamportCertification(impUid: string): Promise<any> {
    const accessToken = await this.getIamportToken();

    const response = await axios.get(
      `https://api.iamport.kr/certifications/${impUid}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
      },
    );

    return response.data;
  }

  async getNaverProfile(token: string): Promise<any> {
    const response = await axios.get(`https://openapi.naver.com/v1/nid/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  constructor(
    private usersService: UsersService,
    private adminService: AdminService,
    private jwtService: JwtService,
    private pointLogService: PointLogService,
    private smsDeliveryService: SmsDeliveryService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ user_id: username });
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    } else if (user) {
      // check with temp password matching
      const tempPasswordInfo = await this.usersService.getTempPasswordInfo(
        user.id,
      );
      if (tempPasswordInfo && !tempPasswordInfo.used) {
        if (bcrypt.compareSync(pass, tempPasswordInfo.temp_password)) {
          const { password, ...result } = user;
          await this.usersService.updateTempPasswordUseFlag(user.id, true);
          return result;
        }
      }
    }
    return null;
  }

  async validateBusiness(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ user_id: username });
    if (user && user.account_type === 'business') {
      if (bcrypt.compareSync(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      } else {
        // check with temp password matching
        const tempPasswordInfo = await this.usersService.getTempPasswordInfo(
          user.id,
        );
        if (tempPasswordInfo && !tempPasswordInfo.used) {
          if (bcrypt.compareSync(pass, tempPasswordInfo.temp_password)) {
            const { password, ...result } = user;
            await this.usersService.updateTempPasswordUseFlag(user.id, true);
            return result;
          }
        }
      }
    }
    return null;
  }

  async validateAdmin(username: string, pass: string): Promise<any> {
    const user = await this.adminService.findOne({ user_id: username });
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  getUserPaload(user: any) {
    return {
      user: {
        id: user.id,
        user_id: user.user_id,
        account_type: user.account_type,
        email: user.email,
        name: user.name,
        roles: ['user'],
        permissions: user.roles,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  async login(authData: any) {
    const payload = this.getUserPaload(authData.user);
    // console.log({payload});
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginAdmin(authData: any) {
    const payload = {
      user: {
        id: authData.user.id,
        user_id: authData.user.user_id,
        email: authData.user.email,
        name: authData.user.name,
        roles: ['admin'],
        created_at: authData.user.created_at,
        updated_at: authData.user.updated_at,
      },
    };
    // console.log({payload});
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserProfile(id: number) {
    return await this.usersService.findOne({ id });
  }

  async register(data: CreateUserDto) {
    const user = await this.usersService.findOne([
      { email: data.email },
      { nickname: data.nickname },
      { user_id: data.user_id },
    ]);
    if (user) {
      throw new BadRequestException('이미 등록된 회원정보입니다.');
    }
    data.password = await bcrypt.hashSync(data.password, 10);
    const response = await this.usersService.create(data);
    if (response) {
      await this.pointLogService.createWithType(
        {
          user_id: response.id,
          point: 100,
          memo: `회원가입`,
        },
        PointType.Account,
      );
      const { password, ...result } = response;
      return {
        data: result,
        access_token: this.jwtService.sign(this.getUserPaload(result)),
      };
    }
  }

  async registerBusiness(data: CreateBusinessDto) {
    const user = await this.usersService.findOne([
      { email: data.email },
      { nickname: data.nickname },
      { user_id: data.user_id },
      { business_reg_num: data.business_reg_num },
    ]);
    if (user) {
      throw new BadRequestException('이미 등록된 회원정보입니다.');
    }
    data.password = await bcrypt.hashSync(data.password, 10);
    const response = await this.usersService.createBusiness(data);
    if (response) {
      await this.pointLogService.createWithType(
        {
          user_id: response.id,
          point: 100,
          memo: `회원가입`,
        },
        PointType.Account,
      );
      const { password, ...result } = response;
      return {
        data: result,
        access_token: this.jwtService.sign(this.getUserPaload(result)),
      };
    }
  }

  async registerAdmin(data: CreateAdminDto) {
    const user = await this.adminService.findOne({ email: data.email });
    if (user) {
      throw new BadRequestException('이미 등록된 정보입니다.');
    }
    const response = await this.adminService.create(data);
    if (response) {
      const { password, ...result } = response;
      return result;
    }
  }

  async authIamport(data: IamportAuthDto) {
    try {
      return await this.getIamportCertification(data.impUid);
    } catch (e) {
      // console.log('e', e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async naverProfile(token: string) {
    try {
      return await this.getNaverProfile(token);
    } catch (e) {
      // console.log('e', e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  async updateBusiness(id: number, updateUserDto: UpdateBusinessDto) {
    return this.usersService.updateBusiness(id, updateUserDto);
  }

  decodeToken(token): any {
    return this.jwtService.decode(token);
  }

  genPassword() {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 12;
    let password = '';
    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }

  generateResetPasswordToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
  }

  async resetPassword(data: ForgotPasswordDto) {
    const is_verified = await this.smsDeliveryService.verifySmsCode(
      data.phone,
      data.sms_code,
    );
    if (!is_verified) {
      throw new BadRequestException('인증코드가 유효하지 않습니다.');
    }
    const user = await this.usersService.findOne({ user_id: data.user_id });
    if (!user) {
      throw new BadRequestException('등록되지 않은 사용자 정보입니다.');
    }
    try {
      const randomPassword = this.genPassword();
      const temp_password = await bcrypt.hashSync(randomPassword, 10);
      await this.usersService.createResetPasswordToken(user, temp_password);
      // Send an email to the user with a link containing the temp password
      const emailContent = `
      안녕하세요.<br>이 메일은 임시 비밀번호 설정 요청에 의하여 발송되었습니다. 설정된 임시 비밀번호는 아래와 같습니다.<br><br>
      ${randomPassword}<br><br>
  
      감사합니다.
      `;
      await this.usersService.sendEmail(
        user.email,
        '비밀번호 재설정',
        null,
        emailContent,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findId(data: FindIdDto) {
    const is_verified = await this.smsDeliveryService.verifySmsCode(
      data.phone,
      data.sms_code,
    );
    if (!is_verified) {
      throw new BadRequestException('인증코드가 유효하지 않습니다.');
    }
    const user = await this.usersService.findOne({ phone: data.phone });
    if (!user) {
      throw new BadRequestException('등록되지 않은 사용자 정보입니다.');
    }
    return {
      userId: user.user_id,
    };
  }
}

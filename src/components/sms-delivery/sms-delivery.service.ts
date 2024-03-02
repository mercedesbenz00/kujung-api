import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, LessThan, MoreThan } from 'typeorm';
import axios, { AxiosRequestConfig } from 'axios';
import { CreateSmsDeliveryDto } from './dto/create-sms-delivery.dto';
import { SmsDelivery } from './entities/sms-delivery.entity';
import { MmsDelivery } from './entities/mms-delivery.entity';
import { SmsCode } from './entities/sms-code.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { SearchSmsDeliveryDto } from './dto/search-sms-delivery.dto';
import { response } from 'express';

@Injectable()
export class SmsDeliveryService {
  private apiUrl = 'https://apis.aligo.in/send/';
  constructor(
    @InjectRepository(SmsDelivery)
    private smsDeliveryRepository: Repository<SmsDelivery>,
    @InjectRepository(MmsDelivery)
    private mmsDeliveryRepository: Repository<MmsDelivery>,
    @InjectRepository(SmsCode)
    private smsCodeRepository: Repository<SmsCode>,
  ) {}

  getTableName(msgType: string): string {
    return msgType === 'SMS' ? 'sms_delivery' : 'mms_delivery';
  }

  getRepository(msgType: string): Repository<SmsDelivery | MmsDelivery> {
    return msgType === 'SMS'
      ? this.smsDeliveryRepository
      : this.mmsDeliveryRepository;
  }

  async sendSmsToPhone(phone: string, content: string) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: process.env.ALIGO_KEY,
        user_id: process.env.ALIGO_USER_ID,
        sender: '031-766-0700',
        receiver: phone,
        msg: "[구정마루]\n" + content,
      },
    };

    const response = await axios.post(this.apiUrl, null, config);
    return response;
  }

  async sendSMS(smsDelivery: SmsDelivery): Promise<boolean> {
    try {
      const response = await this.sendSmsToPhone(
        smsDelivery.phone,
        smsDelivery.content,
      );

      //response?.data?.msg_type - SMS, LMS, MMS
      if (response?.data?.result_code === '1') {
        await this.getRepository(response?.data?.msg_type).save({
          ...smsDelivery,
          status: 1,
          sent_at: new Date(),
        });
        return true;
      } else {
        console.error('sms delivery error', response);
      }
    } catch (error) {
      console.error('sms deliver exception error', error);
    }
    const byteCount = Buffer.byteLength(smsDelivery.content, 'utf8');
    const msgType = byteCount <= 90 ? 'SMS' : 'MMS';
    await this.getRepository(msgType).save({
      ...smsDelivery,
      status: 2,
      sent_at: new Date(),
    });
    return false;
  }

  async generateAndSendSmsCode(phoneNumber: string) {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration date (e.g., 2 minutes from now)
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 2);

    let smsCode = await this.smsCodeRepository.findOne({
      where: {
        phone_number: phoneNumber,
      },
    });
    if (!smsCode) {
      smsCode = new SmsCode();
    }
    smsCode.phone_number = phoneNumber;
    smsCode.code = code;
    smsCode.expiration_date = expirationDate;
    // Store the code in the database
    await this.smsCodeRepository.save(smsCode);

    // Send the code via an SMS service (replace with your SMS service)
    this.sendSmsToPhone(phoneNumber, `sms인증 코드: ${code}`);
  }

  async verifySmsCode(
    phoneNumber: string,
    code: string,
    needDelete = false,
  ): Promise<boolean> {
    const smsCode = await this.smsCodeRepository.findOne({
      where: {
        phone_number: phoneNumber,
        code,
        expiration_date: MoreThan(new Date()), // Check if the code is not expired
      },
    });

    if (smsCode) {
      // Mark the code as used or delete it, depending on requirements
      if (needDelete) {
        await this.smsCodeRepository.remove(smsCode);
      }
      return true;
    } else {
      return false;
    }
  }

  async sendSMSAsync(smsDeliveryList: SmsDelivery[]): Promise<boolean[]> {
    const sendSMSPromises = smsDeliveryList.map((smsDelivery) =>
      this.sendSMS(smsDelivery),
    );
    return Promise.all(sendSMSPromises);
  }

  async create(createSmsDeliveryDto: CreateSmsDeliveryDto) {
    try {
      if (createSmsDeliveryDto.recipients) {
        const deliveryList = [];
        for (const recipient of createSmsDeliveryDto.recipients) {
          if (recipient && recipient.allow_sms_recv) {
            const newDelivery = new SmsDelivery();
            newDelivery.name = recipient.name;
            newDelivery.phone = recipient.phone;
            newDelivery.nickname = recipient.nickname;
            newDelivery.content = createSmsDeliveryDto.content;
            deliveryList.push(newDelivery);
          }
        }
        if (deliveryList.length) {
          const sendSMSPromise = this.sendSMSAsync(deliveryList);
          sendSMSPromise
            .then((results) => {
              // Process the results if needed
              console.log('sms deliver status list', results);
            })
            .catch((error) => {
              // Handle error if needed
              console.error('sms deliver status error', error);
            });
        }
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchSmsDeliveryDto,
  ): Promise<PageDto<SmsDelivery>> {
    const tableName = this.getTableName(pageOptionsDto.msg_type);
    let queryBuilder = this.getRepository(
      pageOptionsDto.msg_type,
    ).createQueryBuilder(tableName);
    if (pageOptionsDto.q !== undefined) {
      queryBuilder = queryBuilder.andWhere(
        `LOWER(${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
        {
          pattern: `%${pageOptionsDto.q}%`,
        },
      );
    }
    if (pageOptionsDto.from && pageOptionsDto.to) {
      queryBuilder = queryBuilder.andWhere(
        `${tableName}.updated_at BETWEEN :from AND :to`,
        {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        },
      );
    } else if (pageOptionsDto.from) {
      queryBuilder = queryBuilder.andWhere(`${tableName}.updated_at >= :from`, {
        from: new Date(pageOptionsDto.from),
      });
    } else if (pageOptionsDto.to) {
      queryBuilder = queryBuilder.andWhere(`${tableName}.updated_at <= :to`, {
        to: new Date(pageOptionsDto.to),
      });
    }

    if (pageOptionsDto.hour !== undefined && pageOptionsDto.hour !== null) {
      queryBuilder = queryBuilder.andWhere(
        `HOUR(${tableName}.updated_at) = :hourNumber`,
        { hourNumber: pageOptionsDto.hour },
      );
    }
    queryBuilder
      .orderBy(
        !!pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'updated_at',
        pageOptionsDto.order,
      )
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      if (pageOptionsDto.msg_type === 'SMS') {
        allCount = await this.smsDeliveryRepository.count();
      } else {
        allCount = await this.mmsDeliveryRepository.count();
      }
    }
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number): Promise<SmsDelivery> {
    return this.smsDeliveryRepository.findOneBy({ id: id });
  }
  findMMSOne(id: number): Promise<MmsDelivery> {
    return this.mmsDeliveryRepository.findOneBy({ id: id });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { BannerSettingDto } from './dto/banner-setting.dto';
import { BannerSetting } from './entities/banner-setting.entity';

@Injectable()
export class BannerSettingService {
  constructor(
    @InjectRepository(BannerSetting)
    private bannerSettingRepository: Repository<BannerSetting>,
  ) {}

  getSetting(bannerType: string): Promise<BannerSetting> {
    return this.bannerSettingRepository.findOne({
      where: {
        banner_type: bannerType,
      },
    });
  }

  async setSetting(
    bannerType: string,
    updateBannerSettingDto: BannerSettingDto,
  ) {
    const bannerSetting = await this.getSetting(bannerType);

    const newBannerSetting = new BannerSetting();
    newBannerSetting.banner_type = bannerType;
    if (bannerSetting) {
      newBannerSetting.id = bannerSetting.id;
      newBannerSetting.auto_transition = bannerSetting.auto_transition;
      newBannerSetting.interval = bannerSetting.interval;
    }
    if (updateBannerSettingDto.auto_transition !== undefined) {
      newBannerSetting.auto_transition = updateBannerSettingDto.auto_transition;
    }

    if (updateBannerSettingDto.interval !== undefined) {
      newBannerSetting.interval = updateBannerSettingDto.interval;
    }

    return await this.bannerSettingRepository.save(newBannerSetting);
  }
}

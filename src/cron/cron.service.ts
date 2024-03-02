import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MainInstagramService } from '../components/main/main-instagram/main-instagram.service';
import { ExpertHouseService } from '../components/expert-house/expert-house.service';
import { OnlineHouseService } from '../components/online-house/online-house.service';
import { ProductService } from '../components/product/product.service';
import { UsersService } from '../components/users/users.service';

@Injectable()
export class CronService {
  constructor(
    private mainInstagramService: MainInstagramService,
    private expertHouseService: ExpertHouseService,
    private onlineHouseService: OnlineHouseService,
    private productService: ProductService,
    private usersService: UsersService,
  ) {}

  // Define a cron job to run every 5 minutes
  // @Cron(CronExpression.EVERY_5_MINUTES)
  // async handleCron() {
  //   // Update main instagram's thumb urls
  //   // console.log('5 mins cron running');
  //   await this.mainInstagramService.updateAllUrls();
  // }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleMonthlyCron() {
    // Reset prev_month_count value with this_month_count value
    await this.expertHouseService.resetThisMonthPopularity();
    await this.onlineHouseService.resetThisMonthPopularity();
    await this.productService.resetThisMonthPopularity();

    await this.expertHouseService.resetThisMonthLikeCount();
    await this.onlineHouseService.resetThisMonthLikeCount();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handlePopularityPoint() {
    // Calculate popularity point
    console.log('Started handlePopularityPoint');
    // await this.productService.updatePopularPoint();
    // await this.expertHouseService.updatePopularPoint();
    await this.onlineHouseService.updatePopularPoint();
    console.log('Finished handlePopularityPoint');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMidnight() {
    await this.usersService.resetDailyLimitCount();
  }
}

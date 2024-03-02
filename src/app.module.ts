import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MainBannerModule } from './components/main/main-banner/main-banner.module';
import { MainYoutubeModule } from './components/main/main-youtube/main-youtube.module';
import { MainInstagramModule } from './components/main/main-instagram/main-instagram.module';
import { MainConstructionCaseModule } from './components/main/main-construction-case//main-construction-case.module';
import { CategoryModule } from './components/category/category.module';
import { AuthModule } from './components/auth/auth.module';
import { UsersModule } from './components/users/users.module';
import { AdminModule } from './components/admin/admin.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { dataSourceOptions } from './config/ormconfig';
import { FileModule } from './components/file/file.module';
import { TagModule } from './components/tag/tag.module';
import { SearchTermModule } from './components/search-term/search-term.module';
import { SearchKeywordModule } from './components/search-keyword/search-keyword.module';
import { SmartStoreModule } from './components/smart-store/smart-store.module';
import { SmartStoreBannerModule } from './components/smart-store-banner/smart-store-banner.module';
import { BannerSettingModule } from './components/banner-setting/banner-setting.module';
import { WishModule } from './components/wish/wish.module';
import { LikeModule } from './components/like/like.module';
import { ProductModule } from './components/product/product.module';
import { MenuModule } from './components/menu/menu.module';
import { PointProductModule } from './components/point-product/point-product.module';
import { PointProductOrderModule } from './components/point-product-order/point-product-order.module';
import { PopupModule } from './components/popup/popup.module';
import { SmsDeliveryModule } from './components/sms-delivery/sms-delivery.module';
import { LabelModule } from './components/label/label.module';
import { OnlineHouseModule } from './components/online-house/online-house.module';
import { ExpertHouseModule } from './components/expert-house/expert-house.module';
import { QuotationModule } from './components/quotation/quotation.module';
import { QuestionAndAnswerModule } from './components/question-and-answer/question-and-answer.module';
import { CommonConstantModule } from './components/common-constant/common-constant.module';
import { IntroBannerModule } from './components/homepage/intro-banner/intro-banner.module';
import { ShowroomBannerModule } from './components/homepage/showroom-banner/showroom-banner.module';
import { AgencyStoreModule } from './components/homepage/agency-store/agency-store.module';
import { SmartcareServiceModule } from './components/homepage/smartcare-service/smartcare-service.module';
import { PortfolioModule } from './components/homepage/portfolio/portfolio.module';
import { CatalogModule } from './components/homepage/catalog/catalog.module';
import { ManagementLawModule } from './components/homepage/management-law/management-law.module';
import { InteriorTrendModule } from './components/homepage/interior-trend/interior-trend.module';
import { CertificationModule } from './components/homepage/certification/certification.module';
import { SmartConstructionCaseModule } from './components/homepage/smart-construction-case/smart-construction-case.module';
import { NotificationModule } from './components/homepage/notification/notification.module';
import { EventModule } from './components/homepage/event/event.module';
import { FaqModule } from './components/homepage/faq/faq.module';
import { PointLogModule } from './components/point-log/point-log.module';
import { ViewLogModule } from './components/view-log/view-log.module';
import { StatisticsModule } from './components/statistics/statistics.module';
import { GlobalSearchModule } from './components/global-search/global-search.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //Add to the import array
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    AuthModule,
    WishModule,
    LikeModule,
    FileModule,
    MainBannerModule,
    MainYoutubeModule,
    MainInstagramModule,
    MainConstructionCaseModule,
    CategoryModule,
    UsersModule,
    AdminModule,
    TagModule,
    SearchTermModule,
    SearchKeywordModule,
    SmartStoreModule,
    SmartStoreBannerModule,
    BannerSettingModule,
    ProductModule,
    MenuModule,
    PointProductModule,
    PointProductOrderModule,
    PopupModule,
    SmsDeliveryModule,
    LabelModule,
    OnlineHouseModule,
    ExpertHouseModule,
    QuotationModule,
    QuestionAndAnswerModule,
    CommonConstantModule,
    IntroBannerModule,
    ShowroomBannerModule,
    AgencyStoreModule,
    SmartcareServiceModule,
    PortfolioModule,
    CatalogModule,
    ManagementLawModule,
    InteriorTrendModule,
    CertificationModule,
    SmartConstructionCaseModule,
    NotificationModule,
    EventModule,
    FaqModule,
    PointLogModule,
    ViewLogModule,
    StatisticsModule,
    GlobalSearchModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule {}

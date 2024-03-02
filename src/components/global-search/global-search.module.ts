import { Module } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchController } from './global-search.controller';
import { SearchKeywordModule } from '../search-keyword/search-keyword.module';
import { ProductModule } from '../product/product.module';
import { ExpertHouseModule } from '../expert-house/expert-house.module';
import { CatalogModule } from '../homepage/catalog/catalog.module';
import { PortfolioModule } from '../homepage/portfolio/portfolio.module';
import { CertificationModule } from '../homepage/certification/certification.module';
import { EventModule } from '../homepage/event/event.module';
import { InteriorTrendModule } from '../homepage/interior-trend/interior-trend.module';
import { IntroBannerModule } from '../homepage/intro-banner/intro-banner.module';
import { ManagementLawModule } from '../homepage/management-law/management-law.module';
import { ShowroomBannerModule } from '../homepage/showroom-banner/showroom-banner.module';
import { SmartConstructionCaseModule } from '../homepage/smart-construction-case/smart-construction-case.module';
import { SmartcareServiceModule } from '../homepage/smartcare-service/smartcare-service.module';

@Module({
  imports: [
    SearchKeywordModule,
    ProductModule,
    ExpertHouseModule,
    CatalogModule,
    PortfolioModule,
    CertificationModule,
    EventModule,
    InteriorTrendModule,
    IntroBannerModule,
    ManagementLawModule,
    ShowroomBannerModule,
    SmartConstructionCaseModule,
    SmartcareServiceModule,
  ],
  exports: [],
  controllers: [GlobalSearchController],
  providers: [GlobalSearchService],
})
export class GlobalSearchModule {}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from 'src/shared/constants';
import { ExpertHouseService } from '../expert-house/expert-house.service';
import { CatalogService } from '../homepage/catalog/catalog.service';
import { CertificationService } from '../homepage/certification/certification.service';
import { EventService } from '../homepage/event/event.service';
import { InteriorTrendService } from '../homepage/interior-trend/interior-trend.service';
import { IntroBannerService } from '../homepage/intro-banner/intro-banner.service';
import { ManagementLawService } from '../homepage/management-law/management-law.service';
import { PortfolioService } from '../homepage/portfolio/portfolio.service';
import { ShowroomBannerService } from '../homepage/showroom-banner/showroom-banner.service';
import { SmartConstructionCaseService } from '../homepage/smart-construction-case/smart-construction-case.service';
import { SmartcareServiceService } from '../homepage/smartcare-service/smartcare-service.service';
import { ProductService } from '../product/product.service';
import { SearchKeywordService } from '../search-keyword/search-keyword.service';
import { SearchGlobalSearchDto } from './dto/search-global-search.dto';

@Injectable()
export class GlobalSearchService {
  constructor(
    private productServie: ProductService,
    private expertHouseService: ExpertHouseService,
    private catalogService: CatalogService,
    private portfolioService: PortfolioService,
    private certificationService: CertificationService,
    private eventService: EventService,
    private interiorTrendService: InteriorTrendService,
    private introBannerService: IntroBannerService,
    private managementLawService: ManagementLawService,
    private showroomBannerService: ShowroomBannerService,
    private smartConstructionCaseService: SmartConstructionCaseService,
    private smartcareServiceService: SmartcareServiceService,
    private searchKeywordService: SearchKeywordService,
  ) {}
  async getItemList(
    pageOptionsDto: SearchGlobalSearchDto,
    userInfo: any = null,
  ) {
    try {
      const keyword = await this.searchKeywordService.getCorrectKeyword(
        pageOptionsDto.q,
      );
      const pageOption = {
        page: 1,
        take: 3,
        skip: 0,
        order: Order.DESC,
        q: keyword,
      };

      let productList = null;
      let onlineHouseList = null;
      let expertHouseList = null;

      const promiseAsyncList1 = [
        this.productServie.getItemList(
          {
            ...pageOption,
            take: 10,
          },
          userInfo,
        ),
        this.expertHouseService.getHouseListForUser(
          {
            ...pageOption,
            entity_type_list: ['online'],
          },
          userInfo,
        ),
        this.expertHouseService.getHouseListForUser(
          {
            ...pageOption,
            entity_type_list: ['expert'],
          },
          userInfo,
        ),
      ];
      const resultList = await Promise.all(promiseAsyncList1);
      if (resultList.length === 3) {
        productList = resultList[0];
        onlineHouseList = resultList[1];
        expertHouseList = resultList[2];
      }

      const promiseAsyncList2 = [
        this.catalogService.getItemList({
          ...pageOption,
          categoryList: ['catalog'],
        }),
        this.catalogService.getItemList({
          ...pageOption,
          categoryList: ['sample'],
        }),
        this.catalogService.getItemList({
          ...pageOption,
          categoryList: ['look'],
        }),
      ];
      let catalogList = null;
      let sampleList = null;
      let lookBookList = null;
      const resultList2 = await Promise.all(promiseAsyncList2);
      if (resultList2.length === 3) {
        catalogList = resultList2[0];
        sampleList = resultList2[1];
        lookBookList = resultList2[2];
      }

      const promiseAsyncList3 = [
        this.portfolioService.getItemList(
          {
            ...pageOption,
            categoryList: ['brand'],
          },
          userInfo,
        ),
        this.portfolioService.getItemList(
          {
            ...pageOption,
            categoryList: ['convention'],
          },
          userInfo,
        ),
        this.portfolioService.getItemList(
          {
            ...pageOption,
            categoryList: ['artist'],
          },
          userInfo,
        ),
        this.certificationService.getItemList({
          ...pageOption,
        }),
      ];
      let brandList = null;
      let conventionList = null;
      let artistList = null;
      let certificationList = null;
      const resultList3 = await Promise.all(promiseAsyncList3);
      if (resultList3.length === 4) {
        brandList = resultList3[0];
        conventionList = resultList3[1];
        artistList = resultList3[2];
        certificationList = resultList3[3];
      }
      // const eventList = await this.eventService.getItemList({
      //   ...pageOption,
      // });
      // const interiorTrendList = await this.interiorTrendService.getItemList({
      //   ...pageOption,
      // });
      // const introBannerList = await this.introBannerService.getItemList({
      //   ...pageOption,
      // });
      // const lawList = await this.managementLawService.getItemList({
      //   ...pageOption,
      // });
      // const showRoomBannerList = await this.showroomBannerService.getItemList({
      //   ...pageOption,
      // });
      // const smartCaseList = await this.smartConstructionCaseService.getItemList(
      //   {
      //     ...pageOption,
      //   },
      // );
      // const smartcareServiceList =
      //   await this.smartcareServiceService.getItemList({
      //     ...pageOption,
      //   });

      return {
        productList,
        onlineHouseList,
        expertHouseList,
        catalogList,
        sampleList,
        lookBookList,
        brandList,
        conventionList,
        artistList,
        certificationList,
        // eventList,
        // interiorTrendList,
        // introBannerList,
        // lawList,
        // showRoomBannerList,
        // smartCaseList,
        // smartcareServiceList,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

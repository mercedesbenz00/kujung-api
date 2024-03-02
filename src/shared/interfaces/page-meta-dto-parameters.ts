import { PageOptionsDto } from './../dtos';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  totalCount: number;
  allCount?: number;
}

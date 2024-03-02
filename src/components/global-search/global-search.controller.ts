import {
  Controller,
  Get,
  Query,
  Request,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { GlobalSearchService } from './global-search.service';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';

import { makeSuccessResponse } from '../../shared/utils';
import { SearchGlobalSearchDto } from './dto/search-global-search.dto';

@Controller('global-search')
@ApiTags('global-search')
export class GlobalSearchController {
  constructor(private readonly globalSearchService: GlobalSearchService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get global search list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and global search list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Query() pageOptionsDto: SearchGlobalSearchDto,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.globalSearchService.getItemList(
      pageOptionsDto,
      user,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }
}

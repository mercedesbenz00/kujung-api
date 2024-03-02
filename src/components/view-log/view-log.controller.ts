import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  Delete,
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
import { ViewLogService } from './view-log.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';

import { makeSuccessResponse } from '../../shared/utils';
import { SearchViewLogDto } from './dto/search-view-log.dto';

@Controller('view-log')
@ApiTags('view-log')
export class ViewLogController {
  constructor(private readonly viewLogService: ViewLogService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my view log list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and view-log list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Query() pageOptionsDto: SearchViewLogDto,
  ) {
    const data = await this.viewLogService.getItemList(
      req.user?.payload?.user?.id,
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }
}

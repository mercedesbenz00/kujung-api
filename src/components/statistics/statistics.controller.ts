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
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse } from '../../shared/utils';

@Controller('statistics')
@ApiTags('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Ping to server' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main banner information',
  })
  @ApiBearerAuth('Authorization')
  @Post('/ping')
  async create(@Res() res: Response, @Request() req) {
    const id = req.user?.payload?.user?.id;
    const data = await this.statisticsService.createOrUpdateVisit(+id);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get  dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and view-log list',
  })
  @ApiBearerAuth('Authorization')
  @Get('/dashboard')
  async getItemList(@Res() res: Response) {
    const data = await this.statisticsService.getDashboard();
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }
}

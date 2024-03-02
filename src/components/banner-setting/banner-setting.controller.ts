import {
  Controller,
  Get,
  Body,
  Put,
  Res,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { BannerSettingService } from './banner-setting.service';
import { BannerSettingDto } from './dto/banner-setting.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('banner-setting')
@ApiTags('banner-setting')
export class BannerSettingController {
  constructor(private readonly bannerSettingService: BannerSettingService) {}

  @ApiOperation({ summary: 'Get banner setting' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and banner setting information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Get(':bannerType')
  async getSetting(
    @Param('bannerType') bannerType: string,
    @Res() res: Response,
  ): Promise<Response> {
    const setting = await this.bannerSettingService.getSetting(bannerType);
    if (setting)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(setting));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Set banner setting' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and banner setting information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':bannerType')
  async setSetting(
    @Param('bannerType') bannerType: string,
    @Body() updateBannerSettingSetingDto: BannerSettingDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.bannerSettingService.setSetting(
      bannerType,
      updateBannerSettingSetingDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Banner setting information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }
}

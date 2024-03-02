import {
  Controller,
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
import { IntroBannerService } from './intro-banner.service';
import { CreateIntroBannerDto } from './dto/create-intro-banner.dto';
import { UpdateIntroBannerDto } from './dto/update-intro-banner.dto';
import { SearchIntroBannerDto } from './dto/search-intro-banner.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/intro-banner')
@ApiTags('homepage/intro-banner')
export class IntroBannerController {
  constructor(private readonly introBannerService: IntroBannerService) {}

  @ApiOperation({ summary: 'Get intro banner' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and intro banner information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @Get('')
  async findOne(@Res() res: Response): Promise<Response> {
    const introBanner = await this.introBannerService.findOne(1);
    if (introBanner)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(introBanner));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update intro banner' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and intro banner information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put('')
  async update(
    @Body() updateIntroBannerDto: UpdateIntroBannerDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.introBannerService.update(
      1,
      updateIntroBannerDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Intro banner information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }
}

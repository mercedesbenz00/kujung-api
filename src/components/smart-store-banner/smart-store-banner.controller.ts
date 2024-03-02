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
import { SmartStoreBannerService } from './smart-store-banner.service';
import { CreateSmartStoreBannerDto } from './dto/create-smart-store-banner.dto';
import { UpdateSmartStoreBannerDto } from './dto/update-smart-store-banner.dto';
import { SearchSmartStoreBannerDto } from './dto/search-smart-store-banner.dto';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from './../auth/guard/roles.guard';
import { Roles } from './../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from './../../shared/utils';

@Controller('smart-store-banner')
@ApiTags('smart-store-banner')
export class SmartStoreBannerController {
  constructor(
    private readonly smartStoreBannerService: SmartStoreBannerService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create smart store banner' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store banner information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createSmartStoreBannerDto: CreateSmartStoreBannerDto,
    @Res() res: Response,
  ) {
    const data = await this.smartStoreBannerService.create(
      createSmartStoreBannerDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smart store banner list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store banner list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchSmartStoreBannerDto,
  ) {
    const data = await this.smartStoreBannerService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smart store banner by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store banner information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const smartStoreBanner = await this.smartStoreBannerService.findOne(+id);
    if (smartStoreBanner)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(smartStoreBanner));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update smart store banner by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store banner information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSmartStoreBannerDto: UpdateSmartStoreBannerDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.smartStoreBannerService.update(
      +id,
      updateSmartStoreBannerDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Smart store information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete smart store banner by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.smartStoreBannerService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

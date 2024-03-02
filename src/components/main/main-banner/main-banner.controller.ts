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
import { MainBannerService } from './main-banner.service';
import { CreateMainBannerDto } from './dto/create-main-banner.dto';
import { UpdateMainBannerDto } from './dto/update-main-banner.dto';
import { SearchMainBannerDto } from './dto/search-main-banner.dto';
import { JwtAuthGuard } from './../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from './../../auth/guard/roles.guard';
import { Roles } from './../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from './../../../shared/utils';

@Controller('main-banner')
@ApiTags('main-banner')
export class MainBannerController {
  constructor(private readonly mainBannerService: MainBannerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create main banner' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main banner information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createMainBannerDto: CreateMainBannerDto,
    @Res() res: Response,
  ) {
    const data = await this.mainBannerService.create(createMainBannerDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get main banner list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main banner list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchMainBannerDto,
  ) {
    const data = await this.mainBannerService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get main banner by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main banner information',
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
    const mainBanner = await this.mainBannerService.findOne(+id);
    if (mainBanner)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(mainBanner));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update main banner by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main banner information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMainBannerDto: UpdateMainBannerDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.mainBannerService.update(
      +id,
      updateMainBannerDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Main banner information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete main banner by id' })
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
    await this.mainBannerService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

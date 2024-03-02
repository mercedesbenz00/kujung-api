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
import { ShowroomBannerService } from './showroom-banner.service';
import { CreateShowroomBannerDto } from './dto/create-showroom-banner.dto';
import { UpdateShowroomBannerDto } from './dto/update-showroom-banner.dto';
import { SearchShowroomBannerDto } from './dto/search-showroom-banner.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/showroom-banner')
@ApiTags('homepage/showroom-banner')
export class ShowroomBannerController {
  constructor(private readonly showroomBannerService: ShowroomBannerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create showroom banner' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and showroom banner information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createShowroomBannerDto: CreateShowroomBannerDto,
    @Res() res: Response,
  ) {
    const data = await this.showroomBannerService.create(
      createShowroomBannerDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get showroom banner list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and showroom banner list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchShowroomBannerDto,
  ) {
    const data = await this.showroomBannerService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get showroom banner by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and showroom banner information',
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
    const showroomBanner = await this.showroomBannerService.findOne(+id);
    if (showroomBanner)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(showroomBanner));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update showroom banner by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and showroom banner information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShowroomBannerDto: UpdateShowroomBannerDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.showroomBannerService.update(
      +id,
      updateShowroomBannerDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Management law information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete showroom banner by id' })
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
    await this.showroomBannerService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

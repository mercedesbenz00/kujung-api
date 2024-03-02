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
import { MainYoutubeService } from './main-youtube.service';
import { CreateMainYoutubeDto } from './dto/create-main-youtube.dto';
import { UpdateMainYoutubeDto } from './dto/update-main-youtube.dto';
import { SearchMainYoutubeDto } from './dto/search-main-youtube.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { Roles } from '../../../decorators/roles.decorator';
import { EntityIdArrayDto } from '../../tag/dto/create-tag.dto';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('main-youtube')
@ApiTags('main-youtube')
export class MainYoutubeController {
  constructor(private readonly mainYoutubeService: MainYoutubeService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create main youtube' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main youtube information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createMainYoutubeDto: CreateMainYoutubeDto,
    @Res() res: Response,
  ) {
    const data = await this.mainYoutubeService.create(createMainYoutubeDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get main youtube list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main youtube list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchMainYoutubeDto,
  ) {
    const data = await this.mainYoutubeService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get main youtube by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main youtube information',
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
    const mainYoutube = await this.mainYoutubeService.findOne(+id);
    if (mainYoutube)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(mainYoutube));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update main youtube by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main youtube information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMainYoutubeDto: UpdateMainYoutubeDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.mainYoutubeService.update(
      +id,
      updateMainYoutubeDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Main youtube information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete main youtube by id' })
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
    await this.mainYoutubeService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Update orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Post('/order')
  async updateBatchOrder(
    @Body() entityIdArrayDto: EntityIdArrayDto,
    @Res() res: Response,
  ) {
    await this.mainYoutubeService.updateBatchOrder(entityIdArrayDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

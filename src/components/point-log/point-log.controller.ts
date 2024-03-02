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
import { PointLogService } from './point-log.service';
import { CreatePointLogDto } from './dto/create-point-log.dto';
import { UpdatePointLogDto } from './dto/update-point-log.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchPointLogDto } from './dto/search-point-log.dto';

@Controller('point-log')
@ApiTags('point-log')
export class PointLogController {
  constructor(private readonly pointLogService: PointLogService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create point log' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point log information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createPointLogDto: CreatePointLogDto,
    @Res() res: Response,
  ) {
    const data = await this.pointLogService.create(createPointLogDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get point log list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point log list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchPointLogDto,
  ) {
    const data = await this.pointLogService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get point log by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point log information',
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
    const pointLog = await this.pointLogService.findOne(+id);
    if (pointLog)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(pointLog));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update point log by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point log information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePointLogDto: UpdatePointLogDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.pointLogService.update(+id, updatePointLogDto);
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Point log information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete point log by id' })
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
    await this.pointLogService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

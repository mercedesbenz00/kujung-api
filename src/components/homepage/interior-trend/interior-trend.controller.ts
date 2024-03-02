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
import { InteriorTrendService } from './interior-trend.service';
import { CreateInteriorTrendDto } from './dto/create-interior-trend.dto';
import { UpdateInteriorTrendDto } from './dto/update-interior-trend.dto';
import { SearchInteriorTrendDto } from './dto/search-interior-trend.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/interior-trend')
@ApiTags('homepage/interior-trend')
export class InteriorTrendController {
  constructor(private readonly interiorTrendService: InteriorTrendService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create interior trend' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and interior trend information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createInteriorTrendDto: CreateInteriorTrendDto,
    @Res() res: Response,
  ) {
    const data = await this.interiorTrendService.create(createInteriorTrendDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get interior trend list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and interior trend list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchInteriorTrendDto,
  ) {
    const data = await this.interiorTrendService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get interior trend by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and interior trend information',
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
    const interiorTrend = await this.interiorTrendService.findOne(+id);
    if (interiorTrend)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(interiorTrend));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update interior trend by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and interior trend information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInteriorTrendDto: UpdateInteriorTrendDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.interiorTrendService.update(
      +id,
      updateInteriorTrendDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Interior trend information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete interior trend by id' })
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
    await this.interiorTrendService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

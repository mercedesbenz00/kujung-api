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
import { PointProductService } from './point-product.service';
import { CreatePointProductDto } from './dto/create-point-product.dto';
import { UpdatePointProductDto } from './dto/update-point-product.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchPointProductDto } from './dto/search-point-product.dto';
import { Order } from 'src/shared/constants';

@Controller('point-product')
@ApiTags('point-product')
export class PointProductController {
  constructor(private readonly pointProductService: PointProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create point product' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createPointProductDto: CreatePointProductDto,
    @Res() res: Response,
  ) {
    const data = await this.pointProductService.create(createPointProductDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get point product list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchPointProductDto,
  ) {
    const data = await this.pointProductService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get next point product' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product',
  })
  @ApiBearerAuth('Authorization')
  @Get(':id/next')
  async getNextPointProduct(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() pageOptionsDto: SearchPointProductDto,
  ) {
    const data = await this.pointProductService.getNextPointProduct(
      +id,
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get prev point product' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and prev point product',
  })
  @ApiBearerAuth('Authorization')
  @Get(':id/prev')
  async getPrevPointProduct(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() pageOptionsDto: SearchPointProductDto,
  ) {
    const data = await this.pointProductService.getPrevPointProduct(
      +id,
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get point product by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product information',
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
    const pointProduct = await this.pointProductService.findOne(+id, true);
    if (pointProduct)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(pointProduct));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update point product by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePointProductDto: UpdatePointProductDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.pointProductService.update(
      +id,
      updatePointProductDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Point product information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete point product by id' })
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
    await this.pointProductService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary:
      'Update point product orders for sepcific depth. Submit all cateory ids of specific depth in desired order',
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
    await this.pointProductService.updateBatchOrder(entityIdArrayDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

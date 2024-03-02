import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
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
import { PointProductOrderService } from './point-product-order.service';
import { MemoService } from './memo.service';
import { CreatePointProductOrderDto } from './dto/create-point-product-order.dto';
import { UpdatePointProductOrderDto } from './dto/update-point-product-order.dto';
import { CreatePointProductOrderMemoDto } from './dto/create-point-product-order-memo.dto';
import { UpdatePointProductOrderMemoDto } from './dto/update-point-product-order-memo.dto';
import { SearchPointProductOrderMemoDto } from './dto/search-point-product-order-memo.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchPointProductOrderDto } from './dto/search-point-product-order.dto';

@Controller('point-product-order')
@ApiTags('point-product-order')
export class PointProductOrderController {
  constructor(
    private readonly pointProductOrderService: PointProductOrderService,
    private readonly memoService: MemoService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create point product order' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product order information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createPointProductOrderDto: CreatePointProductOrderDto,
    @Res() res: Response,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.pointProductOrderService.create(
      createPointProductOrderDto,
      user,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get point product order list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product order list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchPointProductOrderDto,
  ) {
    const data = await this.pointProductOrderService.getItemList(
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get point product order by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product order information',
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
    const pointProductOrder = await this.pointProductOrderService.findOne(+id);
    if (pointProductOrder)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(pointProductOrder));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update point product order by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and point product order information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePointProductOrderDto: UpdatePointProductOrderDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.pointProductOrderService.update(
      +id,
      updatePointProductOrderDto,
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
  @ApiOperation({ summary: 'Delete point product order by id' })
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
    await this.pointProductOrderService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create memo' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo information',
  })
  @ApiBearerAuth('Authorization')
  @Post('/memo')
  async createMemo(
    @Request() req,
    @Body() createMemoDto: CreatePointProductOrderMemoDto,
    @Res() res: Response,
  ) {
    const data = await this.memoService.create(
      createMemoDto,
      req?.user?.payload?.user?.id,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'Get memo list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo list',
  })
  @Post('/memo/list')
  async getMemoList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchPointProductOrderMemoDto,
  ) {
    const data = await this.memoService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'Get memo by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @Get('/memo/:id')
  async getMemo(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const memo = await this.memoService.findOne(+id);
    if (memo) return res.status(HttpStatus.OK).json(makeSuccessResponse(memo));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update memo by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put('/memo/:id')
  async updateMemo(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMemoDto: UpdatePointProductOrderMemoDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.memoService.update(
      +id,
      updateMemoDto,
      req?.user?.payload?.user?.id,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'Memo information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete memo by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Delete('/memo/:id')
  async removeMemo(@Param('id') id: string, @Res() res: Response) {
    await this.memoService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

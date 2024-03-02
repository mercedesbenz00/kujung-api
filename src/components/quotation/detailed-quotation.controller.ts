import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
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
import { DetailedQuotationService } from './detailed-quotation.service';
import { MemoService } from './memo.service';
import { CreateDetailedQuotationDto } from './dto/create-detailed-quotation.dto';
import { UpdateDetailedQuotationDto } from './dto/update-detailed-quotation.dto';
import { SearchDetailedQuotationDto } from './dto/search-detailed-quotation.dto';
import { CreateDetailedQuotationMemoDto } from './dto/create-detailed-quotation-memo.dto';
import { UpdateDetailedQuotationMemoDto } from './dto/update-detailed-quotation-memo.dto';
import { SearchDetailedQuotationMemoDto } from './dto/search-detailed-quotation-memo.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('detailed-quotation')
@ApiTags('detailed-quotation')
export class DetailedQuotationController {
  constructor(
    private readonly detailedQuotationService: DetailedQuotationService,
    private readonly memoService: MemoService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create detailed quotation' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and detailed quotation information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createDetailedQuotationDto: CreateDetailedQuotationDto,
    @Res() res: Response,
  ) {
    const data = await this.detailedQuotationService.create(
      createDetailedQuotationDto,
      req?.user?.payload?.user?.id,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get detailed quotation list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and detailed quotation list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchDetailedQuotationDto,
  ) {
    const data = await this.detailedQuotationService.getItemList(
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get detailed quotation by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and detailed quotation information',
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
    const detailedQuotation = await this.detailedQuotationService.findOne(+id);
    if (detailedQuotation)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(detailedQuotation));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update detailed quotation by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and detailed quotation information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDetailedQuotationDto: UpdateDetailedQuotationDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req?.user?.payload?.user;
    const roles = user?.roles || [];
    const response = await this.detailedQuotationService.update(
      +id,
      updateDetailedQuotationDto,
      user?.id,
      roles.includes('admin'),
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'Online information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete detailed quotation by id' })
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
    await this.detailedQuotationService.remove(+id);
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
    @Body() createMemoDto: CreateDetailedQuotationMemoDto,
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
    @Body() pageOptionsDto: SearchDetailedQuotationMemoDto,
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
    @Body() updateMemoDto: UpdateDetailedQuotationMemoDto,
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

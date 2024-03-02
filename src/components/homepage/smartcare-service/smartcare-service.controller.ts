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
import { SmartcareServiceService } from './smartcare-service.service';
import { MemoService } from './memo.service';
import { CreateSmartcareServiceDto } from './dto/create-smartcare-service.dto';
import { UpdateSmartcareServiceDto } from './dto/update-smartcare-service.dto';
import { SearchSmartcareServiceDto } from './dto/search-smartcare-service.dto';
import { CreateSmartcareServiceMemoDto } from './dto/create-smartcare-service-memo.dto';
import { UpdateSmartcareServiceMemoDto } from './dto/update-smartcare-service-memo.dto';
import { SearchSmartcareServiceMemoDto } from './dto/search-smartcare-service-memo.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/smartcare-service')
@ApiTags('homepage/smartcare-service')
export class SmartcareServiceController {
  constructor(
    private readonly smartcareServiceService: SmartcareServiceService,
    private readonly memoService: MemoService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create smartcare service' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smartcare service information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createSmartcareServiceDto: CreateSmartcareServiceDto,
    @Res() res: Response,
  ) {
    const data = await this.smartcareServiceService.create(
      createSmartcareServiceDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smartcare service list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smartcare service list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchSmartcareServiceDto,
  ) {
    const data = await this.smartcareServiceService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smartcare service by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smartcare service information',
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
    const smartcareService = await this.smartcareServiceService.findOne(+id);
    if (smartcareService)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(smartcareService));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update smartcare service by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smartcare service information',
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
    @Body() updateSmartcareServiceDto: UpdateSmartcareServiceDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.smartcareServiceService.update(
      +id,
      updateSmartcareServiceDto,
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
  @ApiOperation({ summary: 'Delete smartcare service by id' })
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
    await this.smartcareServiceService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update process status and create memo' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo information',
  })
  @ApiBearerAuth('Authorization')
  @Post('/update-status')
  async createMemo(
    @Request() req,
    @Body() createMemoDto: CreateSmartcareServiceMemoDto,
    @Res() res: Response,
  ) {
    await this.smartcareServiceService.updateStatus(
      createMemoDto.smartcare_service_id,
      createMemoDto.status,
    );
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
    @Body() pageOptionsDto: SearchSmartcareServiceMemoDto,
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
    @Body() updateMemoDto: UpdateSmartcareServiceMemoDto,
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

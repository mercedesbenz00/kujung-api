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
import { MainConstructionCaseService } from './main-construction-case.service';
import { CreateMainConstructionCaseDto } from './dto/create-main-construction-case.dto';
import { UpdateMainConstructionCaseDto } from './dto/update-main-construction-case.dto';
import { SearchMainConstructionCaseDto } from './dto/search-main-construction-case.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';
import { EntityIdArrayDto } from '../../tag/dto/create-tag.dto';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('main-construction-case')
@ApiTags('main-construction-case')
export class MainConstructionCaseController {
  constructor(
    private readonly mainConstructionCaseService: MainConstructionCaseService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create main construction case' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main construction case information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createMainConstructionCaseDto: CreateMainConstructionCaseDto,
    @Res() res: Response,
  ) {
    const data = await this.mainConstructionCaseService.create(
      createMainConstructionCaseDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get main construction case list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main construction case list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchMainConstructionCaseDto,
  ) {
    const data = await this.mainConstructionCaseService.getItemList(
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get main construction case by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main construction case information',
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
    const mainConstructionCase = await this.mainConstructionCaseService.findOne(
      +id,
    );
    if (mainConstructionCase)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(mainConstructionCase));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update main construction case by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and main construction case information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMainConstructionCaseDto: UpdateMainConstructionCaseDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.mainConstructionCaseService.update(
      +id,
      updateMainConstructionCaseDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Main construction case information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete main construction case by id' })
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
    await this.mainConstructionCaseService.remove(+id);
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
    await this.mainConstructionCaseService.updateBatchOrder(entityIdArrayDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

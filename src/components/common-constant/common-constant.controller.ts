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
import { CommonConstantService } from './common-constant.service';
import { CreateCommonConstantDto } from './dto/create-common-constant.dto';
import { UpdateCommonConstantDto } from './dto/update-common-constant.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchCommonConstantDto } from './dto/search-common-constant.dto';

@Controller('common-constant')
@ApiTags('common-constant')
export class CommonConstantController {
  constructor(private readonly commonConstantService: CommonConstantService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create common constant' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and common constant information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createCommonConstantDto: CreateCommonConstantDto,
    @Res() res: Response,
  ) {
    const data = await this.commonConstantService.create(
      createCommonConstantDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get common constant list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and common constant list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchCommonConstantDto,
  ) {
    const data = await this.commonConstantService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get common constant by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and common constant information',
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
    const commonConstant = await this.commonConstantService.findOne(+id);
    if (commonConstant)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(commonConstant));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update common constant by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and common constant information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommonConstantDto: UpdateCommonConstantDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.commonConstantService.update(
      +id,
      updateCommonConstantDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Common constant information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete common constant by id' })
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
    await this.commonConstantService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

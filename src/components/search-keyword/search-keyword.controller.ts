import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
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
import { SearchKeywordService } from './search-keyword.service';
import { CreateSearchKeywordDto } from './dto/create-search-keyword.dto';
import { UpdateSearchKeywordDto } from './dto/update-search-keyword.dto';
import { SearchSearchKeywordDto } from './dto/search-search-keyword.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('search-keyword')
@ApiTags('search-keyword')
export class SearchKeywordController {
  constructor(private readonly searchKeywordService: SearchKeywordService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create search keyword' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search keyword information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createSearchKeywordDto: CreateSearchKeywordDto,
    @Res() res: Response,
  ) {
    const data = await this.searchKeywordService.create(createSearchKeywordDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get search keyword list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search keyword list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchSearchKeywordDto,
  ) {
    const data = await this.searchKeywordService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Autocomplete search keyword list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search keyword list',
  })
  @ApiBearerAuth('Authorization')
  @Get('/by/autocomplete')
  async getAutocompleteList(
    @Res() res: Response,
    @Query() queryDto: SearchSearchKeywordDto,
  ) {
    if (queryDto.q) {
      const data = await this.searchKeywordService.getAutocompleteItemList(
        queryDto,
      );
      return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
    }
    return res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get search keyword by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search keyword information',
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
    const searchKeyword = await this.searchKeywordService.findOne(+id);
    if (searchKeyword)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(searchKeyword));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update search keyword by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search keyword information',
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
    @Body() updateSearchKeywordDto: UpdateSearchKeywordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.searchKeywordService.update(
      +id,
      updateSearchKeywordDto,
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
  @ApiOperation({ summary: 'Delete search keyword by id' })
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
    await this.searchKeywordService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

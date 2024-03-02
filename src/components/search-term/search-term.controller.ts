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
import { SearchTermService } from './search-term.service';
import { CreateSearchTermDto } from './dto/create-search-term.dto';
import { UpdateSearchTermDto } from './dto/update-search-term.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchSearchTermDto } from './dto/search-search-term.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';

@Controller('search-term')
@ApiTags('search-term')
export class SearchTermController {
  constructor(private readonly searchTermService: SearchTermService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create search term' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search term information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createSearchTermDto: CreateSearchTermDto,
    @Res() res: Response,
  ) {
    const data = await this.searchTermService.create(createSearchTermDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get search term list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search term list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchSearchTermDto,
  ) {
    const data = await this.searchTermService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get search term by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search term information',
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
    const searchTerm = await this.searchTermService.findOne(+id);
    if (searchTerm)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(searchTerm));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update search term by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and search term information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSearchTermDto: UpdateSearchTermDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.searchTermService.update(
      +id,
      updateSearchTermDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Seach term information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete search term by id' })
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
    await this.searchTermService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Increase search term counts',
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
  @Post('/count')
  async updateBatchOrder(
    @Body() entityIdArrayDto: EntityIdArrayDto,
    @Res() res: Response,
  ) {
    await this.searchTermService.updateCount(entityIdArrayDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

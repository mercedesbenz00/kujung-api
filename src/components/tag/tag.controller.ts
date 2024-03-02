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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchTagDto } from './dto/search-tag.dto';

@Controller('tag')
@ApiTags('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and tag information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(@Body() createTagDto: CreateTagDto, @Res() res: Response) {
    const data = await this.tagService.create(createTagDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'Get tag list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and tag list',
  })
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchTagDto,
  ) {
    const data = await this.tagService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'Get tag by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and tag information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const tag = await this.tagService.findOne(+id);
    if (tag) return res.status(HttpStatus.OK).json(makeSuccessResponse(tag));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update tag by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and tag information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.tagService.update(+id, updateTagDto);
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'Tag information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete tag by id' })
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
    await this.tagService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuListQueryDto } from './dto/menu-list-query.dto';
import { MenuTreeQueryDto } from './dto/menu-tree-query.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('menu')
@ApiTags('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create menu' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and menu information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(@Body() createMenuDto: CreateMenuDto, @Res() res: Response) {
    const data = await this.menuService.create(createMenuDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get menu list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and menu list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: MenuListQueryDto,
  ) {
    const data = await this.menuService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get menu tree list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and menu tree list',
  })
  @ApiBearerAuth('Authorization')
  @Get('/tree')
  async getItemTreeList(
    @Res() res: Response,
    @Query() queryDto: MenuTreeQueryDto,
  ) {
    const data = await this.menuService.getItemTreeList(queryDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'Get menu by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and menu information',
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
    const menu = await this.menuService.findOne(+id);
    if (menu) return res.status(HttpStatus.OK).json(makeSuccessResponse(menu));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update menu by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and menu information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.menuService.update(+id, updateMenuDto);
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'Menu information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete menu by id' })
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
    await this.menuService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary:
      'Update menu orders for sepcific depth. Submit all cateory ids of specific depth in desired order',
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
    await this.menuService.updateBatchOrder(entityIdArrayDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

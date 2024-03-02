import {
  Controller,
  Get,
  Post,
  Body,
  Query,
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
import { SmartStoreService } from './smart-store.service';
import { CreateSmartStoreDto } from './dto/create-smart-store.dto';
import { UpdateSmartStoreDto } from './dto/update-smart-store.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchSmartStoreDto } from './dto/search-smart-store.dto';

@Controller('smart-store')
@ApiTags('smart-store')
export class SmartStoreController {
  constructor(private readonly smartStoreService: SmartStoreService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create smart store' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createSmartStoreDto: CreateSmartStoreDto,
    @Res() res: Response,
  ) {
    const data = await this.smartStoreService.create(createSmartStoreDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smart store list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Query() pageOptionsDto: SearchSmartStoreDto,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.smartStoreService.getItemList(pageOptionsDto, user);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smart store by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req.user?.payload?.user;
    const smartStore = await this.smartStoreService.findOne(+id, user);
    if (smartStore)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(smartStore));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update smart store by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart store information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSmartStoreDto: UpdateSmartStoreDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.smartStoreService.update(
      +id,
      updateSmartStoreDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Smart store information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete smart store by id' })
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
    await this.smartStoreService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

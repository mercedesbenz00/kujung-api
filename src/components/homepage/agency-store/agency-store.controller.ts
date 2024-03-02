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
import { AgencyStoreService } from './agency-store.service';
import { CreateAgencyStoreDto } from './dto/create-agency-store.dto';
import { UpdateAgencyStoreDto } from './dto/update-agency-store.dto';
import { SearchAgencyStoreDto } from './dto/search-agency-store.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/agency-store')
@ApiTags('homepage/agency-store')
export class AgencyStoreController {
  constructor(private readonly agencyStoreService: AgencyStoreService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create agency store' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and agency store information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createAgencyStoreDto: CreateAgencyStoreDto,
    @Res() res: Response,
  ) {
    const data = await this.agencyStoreService.create(createAgencyStoreDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get agency store list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and agency store list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchAgencyStoreDto,
  ) {
    const data =
      pageOptionsDto.lat && pageOptionsDto.lng
        ? await this.agencyStoreService.findNearbyStores(pageOptionsDto)
        : await this.agencyStoreService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get agency store by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and agency store information',
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
    const agencyStore = await this.agencyStoreService.findOne(+id);
    if (agencyStore)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(agencyStore));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update agency store by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and agency store information',
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
    @Body() updateAgencyStoreDto: UpdateAgencyStoreDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.agencyStoreService.update(
      +id,
      updateAgencyStoreDto,
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
  @ApiOperation({ summary: 'Delete agency store by id' })
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
    await this.agencyStoreService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

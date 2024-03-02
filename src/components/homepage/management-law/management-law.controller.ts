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
import { ManagementLawService } from './management-law.service';
import { CreateManagementLawDto } from './dto/create-management-law.dto';
import { UpdateManagementLawDto } from './dto/update-management-law.dto';
import { SearchManagementLawDto } from './dto/search-management-law.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/management-law')
@ApiTags('homepage/management-law')
export class ManagementLawController {
  constructor(private readonly managementLawService: ManagementLawService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create management law' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and management law information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createManagementLawDto: CreateManagementLawDto,
    @Res() res: Response,
  ) {
    const data = await this.managementLawService.create(createManagementLawDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get management law list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and management law list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchManagementLawDto,
  ) {
    const data = await this.managementLawService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get management law by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and management law information',
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
    const managementLaw = await this.managementLawService.findOne(+id);
    if (managementLaw)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(managementLaw));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update management law by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and management law information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateManagementLawDto: UpdateManagementLawDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.managementLawService.update(
      +id,
      updateManagementLawDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Management law information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete management law by id' })
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
    await this.managementLawService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

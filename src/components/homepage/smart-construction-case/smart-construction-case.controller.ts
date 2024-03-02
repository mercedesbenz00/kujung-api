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
import { SmartConstructionCaseService } from './smart-construction-case.service';
import { CreateSmartConstructionCaseDto } from './dto/create-smart-construction-case.dto';
import { UpdateSmartConstructionCaseDto } from './dto/update-smart-construction-case.dto';
import { SearchSmartConstructionCaseDto } from './dto/search-smart-construction-case.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/smart-construction-case')
@ApiTags('homepage/smart-construction-case')
export class SmartConstructionCaseController {
  constructor(
    private readonly smartConstructionCaseService: SmartConstructionCaseService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create smart construction case' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart construction case information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createSmartConstructionCaseDto: CreateSmartConstructionCaseDto,
    @Res() res: Response,
  ) {
    const data = await this.smartConstructionCaseService.create(
      createSmartConstructionCaseDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smart construction case list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart construction case list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchSmartConstructionCaseDto,
  ) {
    const data = await this.smartConstructionCaseService.getItemList(
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get smart construction case by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart construction case information',
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
    const smartConstructionCase =
      await this.smartConstructionCaseService.findOne(+id);
    if (smartConstructionCase)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(smartConstructionCase));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update smart construction case by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and smart construction case information',
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
    @Body() updateSmartConstructionCaseDto: UpdateSmartConstructionCaseDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.smartConstructionCaseService.update(
      +id,
      updateSmartConstructionCaseDto,
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
  @ApiOperation({ summary: 'Delete smart construction case by id' })
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
    await this.smartConstructionCaseService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

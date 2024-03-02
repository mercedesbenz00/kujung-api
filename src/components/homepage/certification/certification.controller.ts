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
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { SearchCertificationDto } from './dto/search-certification.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/certification')
@ApiTags('homepage/certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create certification' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and certification information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createCertificationDto: CreateCertificationDto,
    @Res() res: Response,
  ) {
    const data = await this.certificationService.create(createCertificationDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get certification list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and certification list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchCertificationDto,
  ) {
    const data = await this.certificationService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get certification by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and certification information',
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
    const certification = await this.certificationService.findOne(+id);
    if (certification)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(certification));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update certification by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and certification information',
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
    @Body() updateCertificationDto: UpdateCertificationDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.certificationService.update(
      +id,
      updateCertificationDto,
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
  @ApiOperation({ summary: 'Delete certification by id' })
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
    await this.certificationService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

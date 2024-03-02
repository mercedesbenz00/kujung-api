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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { DuplicateCheckDto } from './../users/dto/duplicate-check.dto';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchAdminDto } from './dto/search-admin.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and admin information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto, @Res() res: Response) {
    const data = await this.adminService.create(createAdminDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({
    summary:
      'Check admin duplication. When create, need to check without id. When update, need to check with id',
  })
  @ApiResponse({
    status: 200,
    description: 'Return success code and duplication information',
  })
  @Post('check-duplication')
  async checkDuplication(
    @Body() duplicateCheckDto: DuplicateCheckDto,
    @Res() res: Response,
  ) {
    const isDuplicate = await this.adminService.checkDuplication(
      duplicateCheckDto.id,
      duplicateCheckDto.email,
      duplicateCheckDto.nickname,
      duplicateCheckDto.user_id,
    );
    if (isDuplicate) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          makeFailureResponse(
            'DUPLICATED_ADMIN',
            '이미 중복된 정보가 존재합니다.',
          ),
        );
    } else {
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(null, '유효한 정보입니다.'));
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get admin list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and admin list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchAdminDto,
  ) {
    const data = await this.adminService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get admin by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and admin information',
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
    const admin = await this.adminService.findOneWithPermissions(+id);
    if (admin)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(admin));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update admin by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and admin information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.adminService.update(+id, updateAdminDto);
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'Admin information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete admin by id' })
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
    await this.adminService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { MemoService } from './memo.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { RemoveUserAccountDto } from './dto/remove-user-account.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { DuplicateCheckDto } from './dto/duplicate-check.dto';
import { BusinessCheckDto } from './dto/business-check.dto';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SearchMemoDto } from './dto/search-memo.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('user-management')
@ApiTags('user-management')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly memoService: MemoService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and user information',
  })
  @ApiBearerAuth('Authorization')
  @Post('user')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.findOne([
      { email: createUserDto.email },
      { nickname: createUserDto.nickname },
      { user_id: createUserDto.user_id },
    ]);
    if (user) {
      throw new BadRequestException('이미 등록된 회원이 존재합니다.');
    }
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hashSync(
        createUserDto.password,
        10,
      );
    }
    const data = await this.usersService.create(createUserDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create business user' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and business user information',
  })
  @ApiBearerAuth('Authorization')
  @Post('business')
  async createBusiness(
    @Body() createUserDto: CreateBusinessDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOne([
      { email: createUserDto.email },
      { nickname: createUserDto.nickname },
      { user_id: createUserDto.user_id },
      { business_reg_num: createUserDto.business_reg_num },
    ]);
    if (user) {
      throw new BadRequestException('이미 등록된 회원이 존재합니다.');
    }
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hashSync(
        createUserDto.password,
        10,
      );
    }
    const data = await this.usersService.createBusiness(createUserDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Check business number' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and business number validation',
  })
  @ApiBearerAuth('Authorization')
  @Post('check-business-num')
  async checkBusinessNum(
    @Body() businessCheckDto: BusinessCheckDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const user = req.user?.payload?.user;
    let userId = null;
    if (user && user.roles && user.roles.includes('user')) {
      userId = user.id;
    }
    const isValid = await this.usersService.checkBusinessNumberValidity(
      userId,
      businessCheckDto.business_num,
    );
    return res
      .status(HttpStatus.OK)
      .json(makeSuccessResponse({ isValid: isValid }));
  }

  @ApiOperation({ summary: 'Check user duplication' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and duplication information',
  })
  @Post('check-duplication')
  async checkDuplication(
    @Body() duplicateCheckDto: DuplicateCheckDto,
    @Res() res: Response,
  ) {
    const isDuplicate = await this.usersService.checkDuplication(
      duplicateCheckDto.id,
      duplicateCheckDto.email,
      duplicateCheckDto.nickname,
      duplicateCheckDto.user_id,
      duplicateCheckDto.business_reg_num,
    );
    if (isDuplicate) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          makeFailureResponse(
            'DUPLICATED_USER',
            '이미 중복된 정보가 존재합니다.',
          ),
        );
    } else {
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(null, '유효한 정보입니다.'));
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get user list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and user list',
  })
  @ApiBearerAuth('Authorization')
  @Get('')
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Query() pageOptionsDto: SearchUserDto,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.usersService.getItemList(pageOptionsDto, user);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and user information',
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
    const userInfo = req.user?.payload?.user;
    const user = await this.usersService.findOne({ id: +id }, userInfo, true);
    if (user) return res.status(HttpStatus.OK).json(makeSuccessResponse(user));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and user information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put('user/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.usersService.update(+id, updateUserDto);
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'User information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update business by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and business information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put('business/:id')
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateBusinessDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.usersService.updateBusiness(+id, updateUserDto);
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Business user information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user by id' })
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
    await this.usersService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update multiple user status' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Post('/status/multi')
  async removeMultiple(
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Res() res: Response,
  ) {
    await this.usersService.updateStatusMultiple(updateUserStatusDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Disable user account' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Post('/removeAccount')
  async removeAccount(
    @Body() removeUserAccount: RemoveUserAccountDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const userId = req.user?.payload?.user?.id;
    await this.usersService.removeUserAccount(userId, removeUserAccount);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and user information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Post('changePassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req.user?.payload?.user?.id;
    const response = await this.usersService.changePassword(
      userId,
      changePasswordDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'User password has been changed successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create memo' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo information',
  })
  @ApiBearerAuth('Authorization')
  @Post('/memo')
  async createMemo(
    @Request() req,
    @Body() createMemoDto: CreateMemoDto,
    @Res() res: Response,
  ) {
    const data = await this.memoService.create(
      createMemoDto,
      req?.user?.payload?.user?.id,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'Get memo list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo list',
  })
  @Post('/memo/list')
  async getMemoList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchMemoDto,
  ) {
    const data = await this.memoService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'Get memo by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @Get('/memo/:id')
  async getMemo(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const memo = await this.memoService.findOne(+id);
    if (memo) return res.status(HttpStatus.OK).json(makeSuccessResponse(memo));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update memo by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and memo information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put('/memo/:id')
  async updateMemo(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMemoDto: UpdateMemoDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.memoService.update(
      +id,
      updateMemoDto,
      req?.user?.payload?.user?.id,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'Memo information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete memo by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Delete('/memo/:id')
  async removeMemo(@Param('id') id: string, @Res() res: Response) {
    await this.memoService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

import {
  Controller,
  Request,
  Post,
  Put,
  Body,
  UseGuards,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AdminLocalAuthGuard } from './guard/admin-local-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from './../../shared/utils';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateBusinessDto } from '../users/dto/update-business.dto';
import { CreateBusinessDto } from '../users/dto/create-business.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { IamportAuthDto } from './dto/iamport-auth.dto';
import { NaverAuthDto } from './dto/naver-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { FindIdDto } from './dto/find-id.dto';
import { SmsDeliveryService } from '../sms-delivery/sms-delivery.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private smsDeliveryService: SmsDeliveryService,
  ) {}

  @UseGuards(AdminLocalAuthGuard)
  @ApiOperation({ summary: 'login' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and access token',
  })
  @Post('admin/login')
  async loginAdmin(
    @Request() req,
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.loginAdmin(req);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'login' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and access token',
  })
  @Post('user/login')
  async login(
    @Request() req,
    @Body() loginDto: UserLoginDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.login(req);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  // @UseGuards(BusinessLocalAuthGuard)
  // @ApiOperation({ summary: 'login for business user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return success code and access token',
  // })
  // @Post('business/login')
  // async loginBusiness(
  //   @Request() req,
  //   @Body() loginDto: UserLoginDto,
  //   @Res() res: Response,
  // ) {
  //   const data = await this.authService.login(req);
  //   return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  // }

  @ApiOperation({ summary: 'auth iamport' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and registered user info',
  })
  @Post('iamport')
  async iamportAuth(@Body() iamPortDto: IamportAuthDto, @Res() res: Response) {
    const data = await this.authService.authIamport(iamPortDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'naver profile info' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and naver profile info',
  })
  @Post('naver-profile')
  async naverProfile(@Body() dto: NaverAuthDto, @Res() res: Response) {
    const data = await this.authService.naverProfile(dto.token);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'register' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and registered user info',
  })
  @Post('admin/register')
  async registerAdmin(
    @Body() registerDto: CreateAdminDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.registerAdmin(registerDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'register' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and registered user info',
  })
  @Post('user/register')
  async register(@Body() registerDto: CreateUserDto, @Res() res: Response) {
    const data = await this.authService.register(registerDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'register for business' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and registered user info',
  })
  @Post('business/register')
  async registerBusiness(
    @Body() registerDto: CreateBusinessDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.registerBusiness(registerDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and registered user info',
  })
  @ApiBearerAuth('Authorization')
  @Get('user/profile')
  async getProfile(@Request() req, @Res() res: Response) {
    const id = req.user?.payload?.user?.id;
    const user = await this.authService.getUserProfile(id);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(user));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and user info',
  })
  @ApiBearerAuth('Authorization')
  @Put('user/profile')
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateBusinessDto,
    @Res() res: Response,
  ) {
    let response = null;
    const id = req.user?.payload?.user?.id;
    const accountType = req.user?.payload?.user?.account_type;
    if (accountType === 'business') {
      response = await this.authService.updateBusiness(
        +id,
        updateUserDto as UpdateBusinessDto,
      );
    } else {
      response = await this.authService.updateUser(
        +id,
        updateUserDto as UpdateUserDto,
      );
    }
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

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('user')
  // @ApiOperation({ summary: 'Update user profile' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return success code and user info',
  // })
  // @ApiBearerAuth('Authorization')
  // @Put('business/profile')
  // async updateBusiness(
  //   @Request() req,
  //   @Body() updateUserDto: UpdateBusinessDto,
  //   @Res() res: Response,
  // ) {
  //   const id = req.user?.payload?.user?.id;
  //   const response = await this.authService.updateBusiness(+id, updateUserDto);
  //   if (response)
  //     return res
  //       .status(HttpStatus.OK)
  //       .json(
  //         makeSuccessResponse(null, 'User information updated successfully'),
  //       );
  //   return res
  //     .status(HttpStatus.NOT_FOUND)
  //     .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and registered admin user info',
  })
  @ApiBearerAuth('Authorization')
  @Get('admin/profile')
  getAdminProfile(@Request() req, @Res() res: Response) {
    return res.status(HttpStatus.OK).json(makeSuccessResponse(req.user));
  }

  @ApiOperation({ summary: 'forgot password' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and send email',
  })
  @Post('user/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.resetPassword(forgotPasswordDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @ApiOperation({ summary: 'find id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and id information',
  })
  @Post('user/find-id')
  async findId(@Body() findIdDto: FindIdDto, @Res() res: Response) {
    const data = await this.authService.findId(findIdDto);

    const publicId =
      data.userId.substring(0, 4) + '*'.repeat(data.userId.length - 4);
    await this.smsDeliveryService.sendSmsToPhone(
      findIdDto.phone,
      `회원님의 아이디는 ${publicId} 입니다.`,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }
}

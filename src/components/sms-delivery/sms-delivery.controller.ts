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
import { SmsDeliveryService } from './sms-delivery.service';
import { CreateSmsDeliveryDto } from './dto/create-sms-delivery.dto';
import { SearchSmsDeliveryDto } from './dto/search-sms-delivery.dto';
import { VerifySmsDto } from './dto/verify-sms.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('sms-delivery')
@ApiTags('sms-delivery')
export class SmsDeliveryController {
  constructor(private readonly smsDeliveryService: SmsDeliveryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create sms delivery' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and sms delivery information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createSmsDeliveryDto: CreateSmsDeliveryDto,
    @Res() res: Response,
  ) {
    const data = await this.smsDeliveryService.create(createSmsDeliveryDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get sms delivery list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and sms delivery list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Query() pageOptionsDto: SearchSmsDeliveryDto,
  ) {
    const data = await this.smsDeliveryService.getItemList(pageOptionsDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get sms delivery by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and sms delivery information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Get('sms/:id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const smsDelivery = await this.smsDeliveryService.findOne(+id);
    if (smsDelivery)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(smsDelivery));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @ApiOperation({ summary: 'Get mms delivery by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and mms delivery information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Get('mms/:id')
  async findMMSOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const smsDelivery = await this.smsDeliveryService.findMMSOne(+id);
    if (smsDelivery)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(smsDelivery));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @ApiOperation({ summary: 'sens sms verification code' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and verification result',
  })
  @Post('sms/send')
  async sendSms(@Body() sendSmsDto: SendSmsDto, @Res() res: Response) {
    await this.smsDeliveryService.generateAndSendSmsCode(sendSmsDto.phone);
    return res.status(HttpStatus.OK).json(makeSuccessResponse({ sent: true }));
  }

  @ApiOperation({ summary: 'verify sms code' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and verification result',
  })
  @Post('sms/verify')
  async verifySms(@Body() verifySmsDto: VerifySmsDto, @Res() res: Response) {
    const is_verified = await this.smsDeliveryService.verifySmsCode(
      verifySmsDto.phone,
      verifySmsDto.sms_code,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse({ is_verified }));
  }
}

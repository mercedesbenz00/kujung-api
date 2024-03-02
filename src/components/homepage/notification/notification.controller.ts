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
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SearchNotificationDto } from './dto/search-notification.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';

@Controller('homepage/notification')
@ApiTags('homepage/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and notification information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createNotificationDto: CreateNotificationDto,
    @Res() res: Response,
  ) {
    const data = await this.notificationService.create(createNotificationDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get notification list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and notification list',
  })
  @ApiBearerAuth('Authorization')
  @Get('')
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Query() pageOptionsDto: SearchNotificationDto,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.notificationService.getItemList(
      pageOptionsDto,
      user,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get notification by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and notification information',
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
    const notification = await this.notificationService.findOne(
      +id,
      user,
      true,
      true,
    );
    if (notification)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(notification));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update notification by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and notification information',
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
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.notificationService.update(
      +id,
      updateNotificationDto,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Notification information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete notification by id' })
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
    await this.notificationService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

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
import { OnlineHouseService } from './online-house.service';
import { UsersService } from '../users/users.service';
import { CreateOnlineHouseDto } from './dto/create-online-house.dto';
import { UpdateOnlineHouseDto } from './dto/update-online-house.dto';
import { SearchOnlineHouseDto } from './dto/search-online-house.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('online-house')
@ApiTags('online-house')
export class OnlineHouseController {
  constructor(
    private readonly onlineHouseService: OnlineHouseService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create online house' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and online house information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createOnlineHouseDto: CreateOnlineHouseDto,
    @Res() res: Response,
  ) {
    const userId = req?.user?.payload?.user?.id;
    // if (userId) {
    //   const dailyLimitCount = await this.usersService.getDailyLimitCount(
    //     userId,
    //   );
    //   if (
    //     dailyLimitCount &&
    //     !!dailyLimitCount.online_house_count &&
    //     dailyLimitCount.online_house_count >= 4
    //   ) {
    //     return res
    //       .status(HttpStatus.BAD_REQUEST)
    //       .json(
    //         makeFailureResponse(
    //           'BAD_REQUEST',
    //           '하루에 4회이상 작성할수 없습니다.',
    //         ),
    //       );
    //   }
    // }
    const data = await this.onlineHouseService.create(
      createOnlineHouseDto,
      req?.user?.payload?.user?.id,
    );
    if (userId) {
      await this.usersService.updateDailyLimitCount(
        userId,
        'online_house_count',
        1,
      );
    }
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get online house list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and online house list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Body() pageOptionsDto: SearchOnlineHouseDto,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.onlineHouseService.getItemList(
      pageOptionsDto,
      user,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get online house by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and online house information',
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
    const onlineHouse = await this.onlineHouseService.findOne(+id, user, true);
    if (onlineHouse)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(onlineHouse));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update online house by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and online house information',
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
    @Body() updateOnlineHouseDto: UpdateOnlineHouseDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req?.user?.payload?.user;
    const roles = user?.roles || [];
    const response = await this.onlineHouseService.update(
      +id,
      updateOnlineHouseDto,
      user?.id,
      roles.includes('admin'),
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete online house by id' })
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
    await this.onlineHouseService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Update orders. Submit all ids of entities in desired order',
  })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Post('/order')
  async updateBatchOrder(
    @Body() entityIdArrayDto: EntityIdArrayDto,
    @Res() res: Response,
  ) {
    await this.onlineHouseService.updateBatchOrder(entityIdArrayDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

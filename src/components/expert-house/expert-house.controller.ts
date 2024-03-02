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
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { RequestBodySizeInterceptor } from '../../interceptor/request-body-size.interceptor';
import { ExpertHouseService } from './expert-house.service';
import { UsersService } from '../users/users.service';
import { CreateExpertHouseDto } from './dto/create-expert-house.dto';
import { UpdateExpertHouseDto } from './dto/update-expert-house.dto';
import { SearchExpertHouseDto } from './dto/search-expert-house.dto';
import { SearchHouseDto } from './dto/search-house.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { SetRequestTimeout } from '../../decorators/set-request-timeout.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('expert-house')
@ApiTags('expert-house')
export class ExpertHouseController {
  constructor(
    private readonly expertHouseService: ExpertHouseService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create expert house' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and expert house information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  @SetRequestTimeout()
  async create(
    @Request() req,
    @Body() createExpertHouseDto: CreateExpertHouseDto,
    @Res() res: Response,
  ) {
    const userId = req?.user?.payload?.user?.id;
    // if (userId) {
    //   const dailyLimitCount = await this.usersService.getDailyLimitCount(
    //     userId,
    //   );
    //   if (
    //     dailyLimitCount &&
    //     !!dailyLimitCount.expert_house_count &&
    //     dailyLimitCount.expert_house_count >= 4
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
    const data = await this.expertHouseService.create(
      createExpertHouseDto,
      userId,
    );
    if (userId) {
      await this.usersService.updateDailyLimitCount(
        userId,
        'expert_house_count',
        1,
      );
    }
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get expert house list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and expert house list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Body() pageOptionsDto: SearchExpertHouseDto,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.expertHouseService.getItemList(
      pageOptionsDto,
      user,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get expert and online house list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and house list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/house-list')
  async getHouseItemList(
    @Res() res: Response,
    @Request() req,
    @Body() pageOptionsDto: SearchHouseDto,
  ) {
    const user = req.user?.payload?.user;
    let data = null;
    if (user && user.roles && user.roles.includes('admin')) {
      data = await this.expertHouseService.getHouseList(pageOptionsDto, user);
    } else {
      data = await this.expertHouseService.getHouseListForUser(
        pageOptionsDto,
        user,
      );
    }
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get expert house by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and expert house information',
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
    const expertHouse = await this.expertHouseService.findOne(
      +id,
      user,
      true,
      true,
    );
    if (expertHouse)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(expertHouse));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new RequestBodySizeInterceptor(1000000000))
  @ApiOperation({ summary: 'Update expert house by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and expert house information',
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
    @Body() updateExpertHouseDto: UpdateExpertHouseDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req?.user?.payload?.user;
    const roles = user?.roles || [];
    const response = await this.expertHouseService.update(
      +id,
      updateExpertHouseDto,
      user?.id,
      roles.includes('admin'),
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(null, 'Expert information updated successfully'),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete expert house by id' })
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
    await this.expertHouseService.remove(+id);
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
    await this.expertHouseService.updateBatchOrder(entityIdArrayDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

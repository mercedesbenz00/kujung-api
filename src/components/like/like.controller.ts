import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Query,
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
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchLikeDto } from './dto/search-like.dto';

@Controller('like')
@ApiTags('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add like item' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and like information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createLikeDto: CreateLikeDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const data = await this.likeService.create(
      req.user?.payload?.user?.id,
      createLikeDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my like list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and like list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Query() pageOptionsDto: SearchLikeDto,
  ) {
    const data = await this.likeService.getItemList(
      req.user?.payload?.user?.id,
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel like' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Post('cancel')
  async cancelLike(
    @Body() createLikeDto: CreateLikeDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const userId = req.user?.payload?.user?.id;
    await this.likeService.unlike(userId, createLikeDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

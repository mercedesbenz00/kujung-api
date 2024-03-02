import {
  Controller,
  Request,
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
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';
import { SearchWishDto } from './dto/search-wish.dto';

@Controller('wish')
@ApiTags('wish')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add wish item' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and wish information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const data = await this.wishService.create(
      req.user?.payload?.user?.id,
      createWishDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my wish list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and wish list',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Query() pageOptionsDto: SearchWishDto,
  ) {
    const data = await this.wishService.getItemList(
      req.user?.payload?.user?.id,
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel wish by id' })
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
    await this.wishService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel wish by entity id and type' })
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
  async cancelWish(
    @Body() createWishDto: CreateWishDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const useId = req.user?.payload?.user?.id;
    await this.wishService.cancelWish(useId, createWishDto);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

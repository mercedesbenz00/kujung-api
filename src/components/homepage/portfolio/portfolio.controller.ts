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
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { SearchPortfolioDto } from './dto/search-portfolio.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

import {
  makeSuccessResponse,
  makeFailureResponse,
} from '../../../shared/utils';
import { Order } from 'src/shared/constants';

@Controller('homepage/portfolio')
@ApiTags('homepage/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create portfolio' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and portfolio information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createPortfolioDto: CreatePortfolioDto,
    @Res() res: Response,
  ) {
    const data = await this.portfolioService.create(createPortfolioDto);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get portfolio list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and portfolio list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Request() req,
    @Body() pageOptionsDto: SearchPortfolioDto,
  ) {
    const user = req.user?.payload?.user;
    const data = await this.portfolioService.getItemList(pageOptionsDto, user);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get next portfolio' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and portfolio',
  })
  @ApiBearerAuth('Authorization')
  @Get(':id/next')
  async getNextPortfolio(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() pageOptionsDto: SearchPortfolioDto,
  ) {
    const data = await this.portfolioService.getNextPortfolio(
      +id,
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get prev portfolio' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and prev portfolio',
  })
  @ApiBearerAuth('Authorization')
  @Get(':id/prev')
  async getPrevPortfolio(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() pageOptionsDto: SearchPortfolioDto,
  ) {
    const data = await this.portfolioService.getPrevPortfolio(
      +id,
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get portfolio by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and portfolio information',
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
    const portfolio = await this.portfolioService.findOne(+id, user, true);
    if (portfolio)
      return res.status(HttpStatus.OK).json(makeSuccessResponse(portfolio));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update portfolio by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and portfolio information',
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
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.portfolioService.update(
      +id,
      updatePortfolioDto,
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
  @ApiOperation({ summary: 'Delete portfolio by id' })
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
    await this.portfolioService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

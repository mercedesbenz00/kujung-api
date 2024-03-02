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
import { QuestionAndAnswerService } from './question-and-answer.service';
import { CreateQuestionAndAnswerDto } from './dto/create-question-and-answer.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { SearchQuestionAndAnswerDto } from './dto/search-question-and-answer.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

import { makeSuccessResponse, makeFailureResponse } from '../../shared/utils';

@Controller('question-and-answer')
@ApiTags('question-and-answer')
export class QuestionAndAnswerController {
  constructor(
    private readonly questionAndAnswerService: QuestionAndAnswerService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create question and answer' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and question and answer information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  async create(
    @Request() req,
    @Body() createQuestionAndAnswerDto: CreateQuestionAndAnswerDto,
    @Res() res: Response,
  ) {
    const data = await this.questionAndAnswerService.create(
      createQuestionAndAnswerDto,
      req?.user?.payload?.user?.id,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get question and answer list' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and question and answer list',
  })
  @ApiBearerAuth('Authorization')
  @Post('/list')
  async getItemList(
    @Res() res: Response,
    @Body() pageOptionsDto: SearchQuestionAndAnswerDto,
  ) {
    const data = await this.questionAndAnswerService.getItemList(
      pageOptionsDto,
    );
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get question and answer by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and question and answer information',
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
    const questionAndAnswer = await this.questionAndAnswerService.findOne(+id);
    if (questionAndAnswer)
      return res
        .status(HttpStatus.OK)
        .json(makeSuccessResponse(questionAndAnswer));
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Update question by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and question information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id')
  async updateQuestion(
    @Request() req,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req?.user?.payload?.user;
    const response = await this.questionAndAnswerService.update(
      +id,
      updateQuestionDto,
      user?.id,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Question and answer information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Answer question by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code and question information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Put(':id/answer')
  async answerQuestion(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = req?.user?.payload?.user;
    const response = await this.questionAndAnswerService.updateAnswer(
      +id,
      updateAnswerDto,
      user?.id,
    );
    if (response)
      return res
        .status(HttpStatus.OK)
        .json(
          makeSuccessResponse(
            null,
            'Question and answer information updated successfully',
          ),
        );
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(makeFailureResponse('NOT_FOUND', '자료가 존재하지 않습니다.'));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete question and answer by id' })
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
    await this.questionAndAnswerService.remove(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete answer by id' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No exist',
  })
  @ApiBearerAuth('Authorization')
  @Delete(':id/answer')
  async removeAnswer(@Param('id') id: string, @Res() res: Response) {
    await this.questionAndAnswerService.removeAnswer(+id);
    res.status(HttpStatus.OK).json(makeSuccessResponse(null));
  }
}

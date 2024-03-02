import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  Body,
  UseInterceptors,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileR2Service } from './file-r2.service';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { makeFailureResponse, makeSuccessResponse } from './../../shared/utils';
import { FilesUploadDto } from './dto/files-upload.dto';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileR2Service) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'upload multiple files, field name should be "files"',
  })
  @ApiResponse({
    status: 200,
    description: 'Return success code and uploaded file information',
  })
  @ApiBearerAuth('Authorization')
  @Post()
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       files: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Body() dto: FilesUploadDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    if (!files || files.length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(makeFailureResponse('400', '첨부된 파일이 없습니다.'));
    }
    const result = [];

    for (const file of files) {
      const data = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
        dto.file_category,
        dto.thumb_yb === 'y',
      );
      result.push(data);
    }
    return res.status(HttpStatus.OK).json(makeSuccessResponse(result));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete file by key' })
  @ApiResponse({
    status: 200,
    description: 'Return success code',
  })
  @ApiBearerAuth('Authorization')
  @Delete('/:key')
  async deleteFile(@Param('key') fileKey: string, @Res() res: Response) {
    const data = await this.fileService.deletePublicFile(fileKey);
    return res.status(HttpStatus.OK).json(makeSuccessResponse(data));
  }
}

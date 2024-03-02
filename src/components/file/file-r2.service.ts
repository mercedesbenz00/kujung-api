import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getResizeImage } from '../../shared/utils';
import Path from 'path';

@Injectable()
export class FileR2Service {
  private s3Client: S3Client;
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_KEY_ID,
      },
      region: 'auto',
    });
  }

  bucketName = this.configService.get('R2_BUCKET_NAME');

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    category: string,
    thumbYB: boolean,
  ) {
    const uploadFileName = category
      ? category.toLowerCase() + '/' + `${Date.now()}-${filename.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-")}`
      : `${Date.now()}-${filename.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-")}`;
    let thumbUrl = '';
    if (thumbYB) {
      const thumbBuffer = await getResizeImage(dataBuffer, 500, 500);
      if (thumbBuffer) {
        const thumbFilename =
          Path.parse(uploadFileName).name +
          '_thumb' +
          Path.extname(uploadFileName);
        const uploadThumbFileName = category
          ? category.toLowerCase() + '/' + thumbFilename
          : thumbFilename;

        const uploadParams = {
          Bucket: this.bucketName,
          Key: uploadThumbFileName,
          Body: thumbBuffer,
        };
        const command = new PutObjectCommand(uploadParams);
        const result = await this.s3Client.send(command);
        if (result) {
          thumbUrl = `${this.configService.get(
            'R2_DOMAIN',
          )}/${uploadThumbFileName}`;
        }
      }
    }
    try {
      const uploadFileParams = {
        Bucket: this.bucketName,
        Key: uploadFileName,
        Body: dataBuffer,
      };
      const commandFile = new PutObjectCommand(uploadFileParams);
      const uploadResult = await this.s3Client.send(commandFile);
      let fileUrl = null;
      if (uploadResult) {
        fileUrl = `${this.configService.get('R2_DOMAIN')}/${uploadFileName}`;
      }
      return thumbYB
        ? { Location: fileUrl, thumbLocation: thumbUrl }
        : { Location: fileUrl };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async deletePublicFile(fileKey: string) {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: fileKey,
      };

      const command = new DeleteObjectCommand(deleteParams);
      const deletedFile = await this.s3Client.send(command);
      return deletedFile;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

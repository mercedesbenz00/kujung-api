import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import * as AWS from 'aws-sdk';
import { getResizeImage } from '../../shared/utils';
import Path from 'path';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});
@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
  s3 = new AWS.S3();

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    category: string,
    thumbYB: boolean,
  ) {
    const uploadFileName = category
      ? category.toLowerCase() + '/' + `${Date.now()}-${filename}`
      : `${Date.now()}-${filename}`;
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

        const uploadThumbResult = await this.s3
          .upload({
            Bucket: this.bucketName,
            Body: thumbBuffer,
            Key: uploadThumbFileName,
            ACL: 'public-read',
            ContentDisposition: 'inline',
          })
          .promise();
        if (uploadThumbResult && uploadThumbResult.Location) {
          thumbUrl = uploadThumbResult.Location;
        }
      }
    }
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Body: dataBuffer,
          Key: `${uploadFileName}`,
          ACL: 'public-read',
          ContentDisposition: 'inline',
        })
        .promise();

      return thumbYB
        ? { ...uploadResult, thumbLocation: thumbUrl }
        : uploadResult;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async deletePublicFile(fileKey: string) {
    try {
      const deletedFile = await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: fileKey,
        })
        .promise();

      return deletedFile;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

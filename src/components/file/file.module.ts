import { Module } from '@nestjs/common';
import { FileR2Service } from './file-r2.service';
import { FileController } from './file.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [FileR2Service],
})
export class FileModule {}

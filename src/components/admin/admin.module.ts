import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminMenu } from './entities/admin-menu.entity';
import { Menu } from '../menu/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, AdminMenu, Menu])],
  exports: [TypeOrmModule, AdminService],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

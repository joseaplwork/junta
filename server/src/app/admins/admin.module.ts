import { UserModule } from '@/server/users/user.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminController } from './admin.controller'
import { Admin } from './admin.entity'
import { AdminService } from './admin.service'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

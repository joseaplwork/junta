import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ParticipantModule } from '@/api/participants/participant.module'

import { AdminController } from './admin.controller'
import { Admin } from './admin.entity'
import { AdminService } from './admin.service'

@Module({
  imports: [ParticipantModule, TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

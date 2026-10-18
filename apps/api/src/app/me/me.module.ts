import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Junta } from '@/api/juntas/entities/junta.entity'

import { MeController } from './me.controller'
import { MeService } from './me.service'

@Module({
  imports: [TypeOrmModule.forFeature([Junta])],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Group } from '@/api/groups/group.entity'
import { ParticipantsGroups } from '@/api/participants-groups/participants-groups.entity'

import { JuntaController } from './junta.controller'
import { Junta } from './junta.entity'
import { JuntaService } from './junta.service'

@Module({
  imports: [TypeOrmModule.forFeature([Junta, Group, ParticipantsGroups])],
  controllers: [JuntaController],
  providers: [JuntaService],
  exports: [JuntaService],
})
export class JuntaModule {}

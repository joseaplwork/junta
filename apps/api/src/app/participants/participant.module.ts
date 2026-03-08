import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Junta } from '@/api/juntas/junta.entity'
import { ParticipantsGroups } from '@/api/participants-groups/participants-groups.entity'

import { ParticipantController } from './participant.controller'
import { Participant } from './participant.entity'
import { ParticipantService } from './participant.service'

@Module({
  imports: [TypeOrmModule.forFeature([Participant, ParticipantsGroups, Junta])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}

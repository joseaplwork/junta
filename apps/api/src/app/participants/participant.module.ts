import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Junta } from '@/api/juntas/junta.entity'
import { ParticipantsSlots } from '@/api/participants-slots/participants-slots.entity'

import { ParticipantController } from './participant.controller'
import { Participant } from './participant.entity'
import { ParticipantService } from './participant.service'

@Module({
  imports: [TypeOrmModule.forFeature([Participant, ParticipantsSlots, Junta])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}

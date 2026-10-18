import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Junta } from '@/api/juntas/entities/junta.entity'

import { Participant } from './entities/participant.entity'
import { ParticipantsController } from './participants.controller'
import { ParticipantsService } from './participants.service'

@Module({
  imports: [TypeOrmModule.forFeature([Participant, Junta])],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}

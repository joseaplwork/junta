import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Admin } from './admins/admin.entity'
import { AdminModule } from './admins/admin.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { Junta } from './juntas/junta.entity'
import { JuntaModule } from './juntas/junta.module'
import { ParticipantsSlots } from './participants-slots/participants-slots.entity'
import { Participant } from './participants/participant.entity'
import { ParticipantModule } from './participants/participant.module'
import { Slot } from './slots/slot.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'joseparedes',
      password: 'admin',
      database: 'juntas',
      entities: [Participant, Admin, Junta, Slot, ParticipantsSlots],
      synchronize: true,
      logging: true,
      logger: 'advanced-console',
    }),
    AuthModule,
    ParticipantModule,
    AdminModule,
    JuntaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

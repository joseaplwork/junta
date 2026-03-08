import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Admin } from './admins/admin.entity'
import { AdminModule } from './admins/admin.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { Contribution } from './contributions/contribution.entity'
import { Distribution } from './distributions/distribution.entity'
import { Group } from './groups/group.entity'
import { Junta } from './juntas/junta.entity'
import { JuntaModule } from './juntas/junta.module'
import { ParticipantsGroups } from './participants-groups/participants-groups.entity'
import { Participant } from './participants/participant.entity'
import { ParticipantModule } from './participants/participant.module'
import { Payout } from './payouts/payout.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'joseparedes',
      password: 'admin',
      database: 'juntas',
      entities: [
        Participant,
        Admin,
        Junta,
        Group,
        ParticipantsGroups,
        Contribution,
        Payout,
        Distribution,
      ],
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

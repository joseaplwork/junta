import { Module, ValidationPipe } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'

import { AdminsModule } from './admins/admins.module'
import { AuthModule } from './auth/auth.module'
import { DomainRuleViolationFilter } from './common/filters/domain-rule-violation.filter'
import { QueryFailedFilter } from './common/filters/query-failed.filter'
import { AppConfigModule } from './config/app-config.module'
import { DatabaseModule } from './database/database.module'
import { HealthController } from './health/health.controller'
import { JuntasModule } from './juntas/juntas.module'
import { MeModule } from './me/me.module'
import { ParticipantAuthModule } from './participant-auth/participant-auth.module'
import { ParticipantsModule } from './participants/participants.module'

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    AdminsModule,
    JuntasModule,
    MeModule,
    ParticipantAuthModule,
    ParticipantsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    { provide: APP_FILTER, useClass: QueryFailedFilter },
    { provide: APP_FILTER, useClass: DomainRuleViolationFilter },
  ],
})
export class AppModule {}

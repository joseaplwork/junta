import { Module, ValidationPipe } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'

import { AccountsModule } from './accounts/accounts.module'
import { AuthModule } from './auth/auth.module'
import { DomainRuleViolationFilter } from './common/filters/domain-rule-violation.filter'
import { QueryFailedFilter } from './common/filters/query-failed.filter'
import { AppConfigModule } from './config/app-config.module'
import { DatabaseModule } from './database/database.module'
import { HealthController } from './health/health.controller'
import { JuntasModule } from './juntas/juntas.module'
import { MeModule } from './me/me.module'
import { MobileAuthModule } from './mobile-auth/mobile-auth.module'
import { ParticipantsModule } from './participants/participants.module'

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    AccountsModule,
    JuntasModule,
    MeModule,
    MobileAuthModule,
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

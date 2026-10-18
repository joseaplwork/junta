import { Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { ParticipantAccount } from './entities/participant-account.entity'
import { ParticipantAuthController } from './participant-auth.controller'
import { ParticipantAuthService } from './participant-auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ParticipantAccount]),
    JwtModule.registerAsync({
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig): JwtModuleOptions => ({
        secret: config.auth.jwtSecret,
      }),
    }),
  ],
  controllers: [ParticipantAuthController],
  providers: [ParticipantAuthService],
})
export class ParticipantAuthModule {}

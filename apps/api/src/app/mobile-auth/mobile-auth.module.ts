import { Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'

import { AccountsModule } from '@/api/accounts/accounts.module'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { MobileAuthController } from './mobile-auth.controller'
import { MobileAuthService } from './mobile-auth.service'

@Module({
  imports: [
    AccountsModule,
    JwtModule.registerAsync({
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig): JwtModuleOptions => ({
        secret: config.auth.jwtSecret,
      }),
    }),
  ],
  controllers: [MobileAuthController],
  providers: [MobileAuthService],
})
export class MobileAuthModule {}

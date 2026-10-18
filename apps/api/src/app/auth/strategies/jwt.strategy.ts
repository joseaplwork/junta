import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { AccessTokenPayload } from '../auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.jwtSecret,
    })
  }

  validate(payload: AccessTokenPayload): AuthenticatedAccount {
    if (payload.type !== 'access') {
      throw new UnauthorizedException()
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
      participantId: payload.participantId,
    }
  }
}

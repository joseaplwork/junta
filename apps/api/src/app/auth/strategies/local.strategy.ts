import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { AuthenticatedAdmin } from '@/api/common/auth/authenticated-admin'

import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' })
  }

  validate(email: string, password: string): Promise<AuthenticatedAdmin> {
    return this.authService.validateCredentials(email, password)
  }
}

import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { AuthService } from '../auth.service'
import { TokenSubject } from '../auth.types'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' })
  }

  /** Passport stores the result on `request.user` for the login handler. */
  validate(email: string, password: string): Promise<TokenSubject> {
    return this.authService.validateCredentials(email, password)
  }
}

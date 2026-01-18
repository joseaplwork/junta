import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { Admin } from '@/api/admins/admin.entity'

import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string): Promise<Partial<Admin>> {
    const admin = await this.auth.validateAdmin(email, password)

    if (!admin) {
      throw new UnauthorizedException()
    }

    return admin
  }
}

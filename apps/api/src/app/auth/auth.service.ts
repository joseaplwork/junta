import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

import { RolePermissionMapping } from '@junta/shared/enums/role-permission'

import { Admin } from '@/api/admins/admin.entity'
import { AdminService } from '@/api/admins/admin.service'

import { AuthTokenPayload } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(
    private admin: AdminService,
    private jwt: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.admin.findOne(username)

    if (!user) {
      throw new NotAcceptableException('could not find the user')
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (user && passwordValid) {
      return user
    }

    return null
  }

  async decodeRefreshToken(token: string): Promise<AuthTokenPayload> {
    try {
      const { username, sub, roles, permissions } = await this.jwt.verify(token)

      return {
        username,
        sub,
        roles,
        permissions,
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  login(admin: Admin) {
    const permissions = new Set(
      admin.roles.map(role => RolePermissionMapping[role]).flat(),
    )

    const payload = {
      username: admin.email,
      sub: admin.id,
      roles: admin.roles,
      permissions: [...permissions],
    }

    return {
      accessToken: this.createAccessToken(payload),
      refreshToken: this.createRefreshToken(payload),
    }
  }

  createAccessToken(payload: AuthTokenPayload) {
    const { tokenId, iat } = this.getRandomTokenAndIat()

    return this.jwt.sign({ ...payload, tokenId, iat })
  }

  createRefreshToken(payload: AuthTokenPayload) {
    const { tokenId, iat } = this.getRandomTokenAndIat()

    return this.jwt.sign({ ...payload, tokenId, iat }, { expiresIn: '7d' })
  }

  private getRandomTokenAndIat() {
    const tokenId = randomUUID()
    const iat = Math.floor(Date.now() / 1000)

    return { tokenId, iat }
  }
}

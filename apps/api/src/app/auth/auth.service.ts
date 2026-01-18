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
    private readonly _admin: AdminService,
    private readonly _jwt: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this._admin.findOne(email)

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordValid = await bcrypt.compare(password, admin.password)

    if (admin && passwordValid) {
      return admin
    }

    return null
  }

  async decodeRefreshToken(token: string): Promise<AuthTokenPayload> {
    try {
      const { email, sub, roles, permissions } = await this._jwt.verify(token)

      return {
        email,
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
      email: admin.email,
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

    return this._jwt.sign({ ...payload, tokenId, iat })
  }

  createRefreshToken(payload: AuthTokenPayload) {
    const { tokenId, iat } = this.getRandomTokenAndIat()

    return this._jwt.sign({ ...payload, tokenId, iat }, { expiresIn: '7d' })
  }

  private getRandomTokenAndIat() {
    const tokenId = randomUUID()
    const iat = Math.floor(Date.now() / 1000)

    return { tokenId, iat }
  }
}

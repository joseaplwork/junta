import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

import { permissionsForRoles } from '@junta/domain'

import { AdminsService } from '@/api/admins/admins.service'
import { Admin } from '@/api/admins/entities/admin.entity'
import { AuthenticatedAdmin } from '@/api/common/auth/authenticated-admin'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import {
  AccessTokenPayload,
  IssuedTokens,
  RefreshTokenPayload,
} from './auth.types'

/** Compared against when the email is unknown, so both failures take the same time. */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(randomUUID(), 10)

export function toAuthenticatedAdmin(
  admin: Pick<Admin, 'id' | 'email' | 'roles'>,
): AuthenticatedAdmin {
  return {
    id: admin.id,
    email: admin.email,
    roles: admin.roles,
    permissions: permissionsForRoles(admin.roles),
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /**
   * Unknown emails, wrong passwords and malformed credentials all fail with the
   * same 401 after a bcrypt comparison, so responses cannot reveal which emails exist.
   */
  async validateCredentials(
    email: unknown,
    password: unknown,
  ): Promise<AuthenticatedAdmin> {
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new UnauthorizedException('Invalid credentials')
    }

    const admin = await this.adminsService.findByEmailWithPassword(email)
    const passwordMatches = await bcrypt.compare(
      password,
      admin?.password ?? DUMMY_PASSWORD_HASH,
    )

    if (!admin || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return toAuthenticatedAdmin(admin)
  }

  issueTokens(admin: AuthenticatedAdmin): IssuedTokens {
    const accessPayload: AccessTokenPayload = {
      type: 'access',
      sub: admin.id,
      email: admin.email,
      roles: admin.roles,
      permissions: admin.permissions,
    }
    const refreshPayload: RefreshTokenPayload = {
      type: 'refresh',
      sub: admin.id,
    }

    return {
      accessToken: this.jwtService.sign(accessPayload, {
        expiresIn: this.config.auth.accessTokenTtl,
        jwtid: randomUUID(),
      }),
      refreshToken: this.jwtService.sign(refreshPayload, {
        expiresIn: this.config.auth.refreshTokenTtl,
        jwtid: randomUUID(),
      }),
    }
  }

  /** Reloads the admin so role changes and deletions apply at the next refresh. */
  async refresh(refreshToken: string | undefined): Promise<IssuedTokens> {
    const payload = this.verifyRefreshToken(refreshToken)
    const admin = await this.adminsService.findEntityById(payload.sub)

    if (!admin) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return this.issueTokens(toAuthenticatedAdmin(admin))
  }

  private verifyRefreshToken(token: string | undefined): RefreshTokenPayload {
    if (!token) {
      throw new UnauthorizedException('Missing refresh token')
    }

    let payload: RefreshTokenPayload | undefined

    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(token)
    } catch {
      payload = undefined
    }

    if (payload?.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return payload
  }
}

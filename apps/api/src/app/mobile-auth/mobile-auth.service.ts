import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

import { Role, TokenPairResponse } from '@junta/contracts'

import { AccountsService } from '@/api/accounts/accounts.service'
import { signTokens, toTokenSubject } from '@/api/auth/auth.service'
import { RefreshTokenPayload } from '@/api/auth/auth.types'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { MobileLoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

/** Compared against when the email is unknown, so both failures take the same time. */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(randomUUID(), 10)

/**
 * Sign-in for the mobile app (spec 003, spec 004). Every account can use it.
 * Tokens travel in the body, never in cookies. Refresh tokens carry
 * `kind: 'mobile'`, so the web refresh endpoint refuses them and this one
 * refuses web tokens.
 */
@Injectable()
export class MobileAuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /** Signing up creates a participant-only account (spec 004). */
  async register(dto: RegisterDto): Promise<TokenPairResponse> {
    const account = await this.accountsService.createAccount({
      ...dto,
      roles: [Role.PARTICIPANT],
    })

    return signTokens(
      this.jwtService,
      this.config,
      toTokenSubject(account),
      'mobile',
    )
  }

  async login(dto: MobileLoginDto): Promise<TokenPairResponse> {
    const account = await this.accountsService.findByEmailWithPassword(
      dto.email,
    )
    const passwordMatches = await bcrypt.compare(
      dto.password,
      account?.password ?? DUMMY_PASSWORD_HASH,
    )

    if (!account || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return signTokens(
      this.jwtService,
      this.config,
      toTokenSubject(account),
      'mobile',
    )
  }

  async refresh(refreshToken: string): Promise<TokenPairResponse> {
    const payload = this.verifyRefreshToken(refreshToken)
    const account = await this.accountsService.findEntityById(payload.sub)

    if (!account || account.tokenVersion !== (payload.ver ?? 0)) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return signTokens(
      this.jwtService,
      this.config,
      toTokenSubject(account),
      'mobile',
    )
  }

  /** Ends every session of the account. Never fails: logout always succeeds. */
  async logout(refreshToken: string): Promise<void> {
    let payload: RefreshTokenPayload

    try {
      payload = this.verifyRefreshToken(refreshToken)
    } catch {
      return
    }

    await this.accountsService.revokeSessions(payload.sub, payload.ver ?? 0)
  }

  private verifyRefreshToken(token: string): RefreshTokenPayload {
    let payload: RefreshTokenPayload | undefined

    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(token)
    } catch {
      payload = undefined
    }

    if (payload?.type !== 'refresh' || payload.kind !== 'mobile') {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return payload
  }
}

import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

import { canUseWebApp, permissionsForRoles } from '@junta/domain'

import { AccountsService } from '@/api/accounts/accounts.service'
import { Account } from '@/api/accounts/entities/account.entity'
import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import {
  AccessTokenPayload,
  IssuedTokens,
  RefreshTokenPayload,
  TokenSubject,
} from './auth.types'

/** Compared against when the email is unknown, so both failures take the same time. */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(randomUUID(), 10)

type AccountClaims = Pick<Account, 'id' | 'email' | 'roles'> & {
  participant?: { id: string } | null
}

export function toAuthenticatedAccount(
  account: AccountClaims,
): AuthenticatedAccount {
  return {
    id: account.id,
    email: account.email,
    roles: account.roles,
    permissions: permissionsForRoles(account.roles),
    participantId: account.participant?.id,
  }
}

export function toTokenSubject(
  account: AccountClaims & Pick<Account, 'tokenVersion'>,
): TokenSubject {
  return {
    ...toAuthenticatedAccount(account),
    tokenVersion: account.tokenVersion,
  }
}

/** Signs access and refresh tokens; shared by the web and the mobile sign-in. */
export function signTokens(
  jwtService: JwtService,
  config: AppConfig,
  subject: TokenSubject,
  kind?: RefreshTokenPayload['kind'],
): IssuedTokens {
  const accessPayload: AccessTokenPayload = {
    type: 'access',
    sub: subject.id,
    email: subject.email,
    roles: subject.roles,
    permissions: subject.permissions,
    participantId: subject.participantId,
  }
  const refreshPayload: RefreshTokenPayload = {
    type: 'refresh',
    sub: subject.id,
    ver: subject.tokenVersion,
    ...(kind ? { kind } : {}),
  }

  return {
    accessToken: jwtService.sign(accessPayload, {
      expiresIn: config.auth.accessTokenTtl,
      jwtid: randomUUID(),
    }),
    refreshToken: jwtService.sign(refreshPayload, {
      expiresIn: config.auth.refreshTokenTtl,
      jwtid: randomUUID(),
    }),
  }
}

/** Sign-in for the web app, with the refresh token in a cookie. */
@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /**
   * Unknown emails, wrong passwords and malformed credentials all fail with the
   * same 401 after a bcrypt comparison, so responses cannot reveal which emails
   * exist. A correct password on a participant-only account gets 403 (BR-14).
   */
  async validateCredentials(
    email: unknown,
    password: unknown,
  ): Promise<TokenSubject> {
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new UnauthorizedException('Invalid credentials')
    }

    const account = await this.accountsService.findByEmailWithPassword(email)
    const passwordMatches = await bcrypt.compare(
      password,
      account?.password ?? DUMMY_PASSWORD_HASH,
    )

    if (!account || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials')
    }

    assertWebAccess(account.roles)

    return toTokenSubject(account)
  }

  issueTokens(subject: TokenSubject): IssuedTokens {
    return signTokens(this.jwtService, this.config, subject)
  }

  /**
   * Reloads the account so role changes and deletions apply at the next
   * refresh. A token issued before the account's latest logout or password
   * change is rejected (spec 002).
   */
  async refresh(refreshToken: string | undefined): Promise<IssuedTokens> {
    const payload = this.verifyRefreshToken(refreshToken)
    const account = await this.accountsService.findEntityById(payload.sub)

    if (!account || account.tokenVersion !== (payload.ver ?? 0)) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    assertWebAccess(account.roles)

    return this.issueTokens(toTokenSubject(account))
  }

  /**
   * Ends every session of the account that owns the refresh token (spec 002).
   * A missing, invalid or already revoked token changes nothing, because
   * logging out must always succeed.
   */
  async logout(refreshToken: string | undefined): Promise<void> {
    let payload: RefreshTokenPayload

    try {
      payload = this.verifyRefreshToken(refreshToken)
    } catch {
      return
    }

    await this.accountsService.revokeSessions(payload.sub, payload.ver ?? 0)
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

    if (payload?.type !== 'refresh' || payload.kind !== undefined) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return payload
  }
}

/** BR-14: the web app is for admins and organizers. */
function assertWebAccess(roles: Account['roles']): void {
  if (!canUseWebApp(roles)) {
    throw new ForbiddenException(
      'The web app is for admins and organizers. Participants use the mobile app.',
    )
  }
}

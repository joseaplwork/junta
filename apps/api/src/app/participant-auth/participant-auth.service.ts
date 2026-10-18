import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { DataSource, Repository } from 'typeorm'

import { ParticipantTokensResponse, Role } from '@junta/contracts'
import { permissionsForRoles } from '@junta/domain'

import { AccessTokenPayload, RefreshTokenPayload } from '@/api/auth/auth.types'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'
import { Participant } from '@/api/participants/entities/participant.entity'

import { ParticipantLoginDto } from './dto/participant-login.dto'
import { ParticipantRegisterDto } from './dto/participant-register.dto'
import { ParticipantAccount } from './entities/participant-account.entity'

const BCRYPT_ROUNDS = 10

/** Compared against when the email is unknown, so both failures take the same time. */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(randomUUID(), 10)

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

/**
 * Sign-in for participants in the mobile app (spec 003). Tokens travel in the
 * body, never in cookies. Refresh tokens carry `kind: 'participant'`, so the
 * admin refresh endpoint refuses them and this one refuses admin tokens.
 */
@Injectable()
export class ParticipantAuthService {
  constructor(
    @InjectRepository(ParticipantAccount)
    private readonly accounts: Repository<ParticipantAccount>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  /** A new account always creates a new participant (spec 003, Q-16). */
  async register(
    dto: ParticipantRegisterDto,
  ): Promise<ParticipantTokensResponse> {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)

    const account = await this.dataSource.transaction(async manager => {
      const participant = await manager.save(
        manager.create(Participant, {
          name: dto.name,
          surname: dto.surname,
          phoneNumber: dto.phoneNumber,
        }),
      )

      return manager.save(
        manager.create(ParticipantAccount, {
          email: normalizeEmail(dto.email),
          password: passwordHash,
          participantId: participant.id,
        }),
      )
    })

    return this.issueTokens(account)
  }

  async login(dto: ParticipantLoginDto): Promise<ParticipantTokensResponse> {
    const account = await this.accounts
      .createQueryBuilder('account')
      .addSelect('account.password')
      .where('account.email = :email', { email: normalizeEmail(dto.email) })
      .getOne()
    const passwordMatches = await bcrypt.compare(
      dto.password,
      account?.password ?? DUMMY_PASSWORD_HASH,
    )

    if (!account || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.issueTokens(account)
  }

  async refresh(refreshToken: string): Promise<ParticipantTokensResponse> {
    const payload = this.verifyRefreshToken(refreshToken)
    const account = await this.accounts.findOneBy({ id: payload.sub })

    if (!account || account.tokenVersion !== (payload.ver ?? 0)) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return this.issueTokens(account)
  }

  /** Ends every session of the account. Never fails: logout always succeeds. */
  async logout(refreshToken: string): Promise<void> {
    let payload: RefreshTokenPayload

    try {
      payload = this.verifyRefreshToken(refreshToken)
    } catch {
      return
    }

    await this.accounts.increment(
      { id: payload.sub, tokenVersion: payload.ver ?? 0 },
      'tokenVersion',
      1,
    )
  }

  issueTokens(
    account: Pick<
      ParticipantAccount,
      'id' | 'email' | 'participantId' | 'tokenVersion'
    >,
  ): ParticipantTokensResponse {
    const roles = [Role.PARTICIPANT]
    const accessPayload: AccessTokenPayload = {
      type: 'access',
      sub: account.id,
      email: account.email,
      roles,
      permissions: permissionsForRoles(roles),
      participantId: account.participantId,
    }
    const refreshPayload: RefreshTokenPayload = {
      type: 'refresh',
      kind: 'participant',
      sub: account.id,
      ver: account.tokenVersion,
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

  private verifyRefreshToken(token: string): RefreshTokenPayload {
    let payload: RefreshTokenPayload | undefined

    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(token)
    } catch {
      payload = undefined
    }

    if (payload?.type !== 'refresh' || payload.kind !== 'participant') {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return payload
  }
}

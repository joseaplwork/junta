import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { DataSource } from 'typeorm'

import { Permission } from '@junta/contracts'

import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { ParticipantAccount } from './entities/participant-account.entity'
import { ParticipantAuthService } from './participant-auth.service'

const config = {
  auth: {
    jwtSecret: 'test-secret',
    accessTokenTtl: '1m',
    refreshTokenTtl: '7d',
  },
} as AppConfig

describe('ParticipantAuthService', () => {
  let service: ParticipantAuthService
  const jwtService = new JwtService({ secret: config.auth.jwtSecret })
  const queryBuilder = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }
  const accounts = {
    createQueryBuilder: jest.fn(() => queryBuilder),
    findOneBy: jest.fn(),
    increment: jest.fn(),
  }
  const account = {
    id: 'account-1',
    email: 'ana@junta.test',
    participantId: 'participant-1',
    tokenVersion: 0,
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const moduleRef = await Test.createTestingModule({
      providers: [
        ParticipantAuthService,
        { provide: getRepositoryToken(ParticipantAccount), useValue: accounts },
        { provide: DataSource, useValue: {} },
        { provide: JwtService, useValue: jwtService },
        { provide: APP_CONFIG, useValue: config },
      ],
    }).compile()

    service = moduleRef.get(ParticipantAuthService)
  })

  it('issues participant tokens limited to self:read (BR-15)', () => {
    const { accessToken, refreshToken } = service.issueTokens(account)

    expect(jwtService.verify(accessToken)).toMatchObject({
      type: 'access',
      participantId: 'participant-1',
      permissions: [Permission.SELF_READ],
    })
    expect(jwtService.verify(refreshToken)).toMatchObject({
      type: 'refresh',
      kind: 'participant',
      ver: 0,
    })
  })

  it('looks up the email in lowercase and rejects a wrong password like an unknown email', async () => {
    queryBuilder.getOne.mockResolvedValue({
      ...account,
      password: await bcrypt.hash('right-password', 4),
    })

    await expect(
      service.login({ email: ' Ana@Junta.TEST ', password: 'wrong' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'))
    expect(queryBuilder.where).toHaveBeenCalledWith('account.email = :email', {
      email: 'ana@junta.test',
    })
  })

  it('refuses an admin refresh token', async () => {
    const adminToken = jwtService.sign({
      type: 'refresh',
      sub: 'admin-1',
      ver: 0,
    })

    await expect(service.refresh(adminToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
  })

  it('refuses a refresh token issued before the latest logout', async () => {
    const { refreshToken } = service.issueTokens(account)

    accounts.findOneBy.mockResolvedValue({ ...account, tokenVersion: 1 })

    await expect(service.refresh(refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
  })

  it('ends every session on logout, and ignores a forged token', async () => {
    const { refreshToken } = service.issueTokens(account)

    await service.logout(refreshToken)
    await service.logout('forged')

    expect(accounts.increment).toHaveBeenCalledTimes(1)
    expect(accounts.increment).toHaveBeenCalledWith(
      { id: 'account-1', tokenVersion: 0 },
      'tokenVersion',
      1,
    )
  })
})

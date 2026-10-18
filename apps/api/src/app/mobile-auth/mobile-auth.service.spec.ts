import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'

import { Permission, Role } from '@junta/contracts'

import { AccountsService } from '@/api/accounts/accounts.service'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { MobileAuthService } from './mobile-auth.service'

const config = {
  auth: {
    jwtSecret: 'test-secret',
    accessTokenTtl: '1m',
    refreshTokenTtl: '7d',
  },
} as AppConfig

describe('MobileAuthService', () => {
  let service: MobileAuthService
  const jwtService = new JwtService({ secret: config.auth.jwtSecret })
  const accountsService = {
    createAccount: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    findEntityById: jest.fn(),
    revokeSessions: jest.fn(),
  }
  const account = {
    id: 'account-1',
    email: 'ana@junta.test',
    roles: [Role.PARTICIPANT],
    tokenVersion: 0,
    participant: { id: 'participant-1' },
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const moduleRef = await Test.createTestingModule({
      providers: [
        MobileAuthService,
        { provide: AccountsService, useValue: accountsService },
        { provide: JwtService, useValue: jwtService },
        { provide: APP_CONFIG, useValue: config },
      ],
    }).compile()

    service = moduleRef.get(MobileAuthService)
  })

  it('signs up a participant-only account (spec 004)', async () => {
    accountsService.createAccount.mockResolvedValue(account)

    const tokens = await service.register({
      email: 'ana@junta.test',
      password: 'ana-password',
      name: 'Ana',
      surname: 'Diaz',
      phoneNumber: '600',
    })

    expect(accountsService.createAccount).toHaveBeenCalledWith(
      expect.objectContaining({ roles: [Role.PARTICIPANT] }),
    )
    expect(jwtService.verify(tokens.accessToken)).toMatchObject({
      participantId: 'participant-1',
      permissions: [Permission.SELF_READ],
    })
    expect(jwtService.verify(tokens.refreshToken)).toMatchObject({
      kind: 'mobile',
      ver: 0,
    })
  })

  it('rejects a wrong password like an unknown email', async () => {
    accountsService.findByEmailWithPassword.mockResolvedValue({
      ...account,
      password: await bcrypt.hash('right-password', 4),
    })

    await expect(
      service.login({ email: 'ana@junta.test', password: 'wrong' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'))
  })

  it('refuses a web refresh token', async () => {
    const webToken = jwtService.sign({
      type: 'refresh',
      sub: 'account-1',
      ver: 0,
    })

    await expect(service.refresh(webToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
  })

  it('refuses a refresh token issued before the latest logout', async () => {
    accountsService.findByEmailWithPassword.mockResolvedValue({
      ...account,
      password: await bcrypt.hash('right-password', 4),
    })
    const { refreshToken } = await service.login({
      email: 'ana@junta.test',
      password: 'right-password',
    })

    accountsService.findEntityById.mockResolvedValue({
      ...account,
      tokenVersion: 1,
    })

    await expect(service.refresh(refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
  })

  it('ends every session on logout, and ignores a forged token', async () => {
    accountsService.findByEmailWithPassword.mockResolvedValue({
      ...account,
      password: await bcrypt.hash('right-password', 4),
    })
    const { refreshToken } = await service.login({
      email: 'ana@junta.test',
      password: 'right-password',
    })

    await service.logout(refreshToken)
    await service.logout('forged')

    expect(accountsService.revokeSessions).toHaveBeenCalledTimes(1)
    expect(accountsService.revokeSessions).toHaveBeenCalledWith('account-1', 0)
  })
})

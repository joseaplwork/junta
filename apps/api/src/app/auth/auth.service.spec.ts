import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'

import { Permission, Role } from '@junta/contracts'

import { AdminsService } from '@/api/admins/admins.service'
import { Admin } from '@/api/admins/entities/admin.entity'
import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import { AuthService } from './auth.service'

const config = {
  auth: {
    jwtSecret: 'test-secret',
    accessTokenTtl: '1m',
    refreshTokenTtl: '7d',
  },
} as AppConfig

describe('AuthService', () => {
  let service: AuthService
  const jwtService = new JwtService({ secret: config.auth.jwtSecret })
  const adminsService = {
    findByEmailWithPassword: jest.fn(),
    findEntityById: jest.fn(),
  }

  const admin = async (): Promise<Admin> =>
    Object.assign(new Admin(), {
      id: 'admin-1',
      email: 'ana@junta.test',
      roles: [Role.ADMIN],
      password: await bcrypt.hash('right-password', 4),
    })

  beforeEach(async () => {
    jest.clearAllMocks()

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AdminsService, useValue: adminsService },
        { provide: JwtService, useValue: jwtService },
        { provide: APP_CONFIG, useValue: config },
      ],
    }).compile()

    service = moduleRef.get(AuthService)
  })

  describe('validateCredentials', () => {
    it('returns the admin with permissions derived from roles (BR-12)', async () => {
      adminsService.findByEmailWithPassword.mockResolvedValue(await admin())

      const result = await service.validateCredentials(
        'ana@junta.test',
        'right-password',
      )

      expect(result.permissions).toContain(Permission.JUNTA_CREATE)
      expect(result.permissions).not.toContain(Permission.ADMIN_CREATE)
    })

    it.each([
      ['an unknown email', null],
      ['a wrong password', 'admin'],
    ])('rejects %s with the same message', async (_case, found) => {
      adminsService.findByEmailWithPassword.mockResolvedValue(
        found ? await admin() : null,
      )

      await expect(
        service.validateCredentials('ana@junta.test', 'wrong-password'),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'))
    })

    it.each([
      ['a numeric password', 'ana@junta.test', 1],
      ['an object email', { $ne: '' }, 'right-password'],
    ])(
      'rejects %s with 401 instead of crashing',
      async (_case, email, password) => {
        adminsService.findByEmailWithPassword.mockResolvedValue(await admin())

        await expect(
          service.validateCredentials(email, password),
        ).rejects.toThrow(new UnauthorizedException('Invalid credentials'))
        expect(adminsService.findByEmailWithPassword).not.toHaveBeenCalled()
      },
    )
  })

  describe('issueTokens and refresh', () => {
    const authenticated = {
      id: 'admin-1',
      email: 'ana@junta.test',
      roles: [Role.ADMIN],
      permissions: [Permission.JUNTA_READ],
    }

    it('signs an access token carrying the session claims', () => {
      const { accessToken } = service.issueTokens(authenticated)

      expect(jwtService.verify(accessToken)).toMatchObject({
        type: 'access',
        sub: 'admin-1',
        roles: [Role.ADMIN],
      })
    })

    it('refuses an access token presented as a refresh token', async () => {
      const { accessToken } = service.issueTokens(authenticated)

      await expect(service.refresh(accessToken)).rejects.toBeInstanceOf(
        UnauthorizedException,
      )
    })

    it('refuses to refresh for an admin that no longer exists', async () => {
      const { refreshToken } = service.issueTokens(authenticated)

      adminsService.findEntityById.mockResolvedValue(null)

      await expect(service.refresh(refreshToken)).rejects.toBeInstanceOf(
        UnauthorizedException,
      )
    })

    it('issues new tokens from the roles currently stored', async () => {
      const { refreshToken } = service.issueTokens(authenticated)

      adminsService.findEntityById.mockResolvedValue(
        Object.assign(await admin(), { roles: [Role.SUPER_ADMIN] }),
      )

      const tokens = await service.refresh(refreshToken)

      expect(jwtService.verify(tokens.accessToken)).toMatchObject({
        roles: [Role.SUPER_ADMIN],
      })
    })

    it('rejects a missing refresh token', async () => {
      await expect(service.refresh(undefined)).rejects.toBeInstanceOf(
        UnauthorizedException,
      )
    })
  })
})

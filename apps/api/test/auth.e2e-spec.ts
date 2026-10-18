import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { Permission, Role } from '@junta/contracts'

import { APP_CONFIG, AppConfig } from '@/api/config/app-config'

import {
  E2E_ADMIN,
  E2eApp,
  apiPath,
  asSuperAdmin,
  createE2eApp,
} from './support/e2e-app'

const refreshCookieOf = (response: request.Response): string => {
  const cookies = response.headers['set-cookie'] as unknown as string[]

  return cookies.find(cookie => cookie.startsWith('refreshToken=')) ?? ''
}

describe('Auth (e2e)', () => {
  let e2e: E2eApp
  const server = (): Parameters<typeof request>[0] => e2e.app.getHttpServer()

  beforeAll(async () => {
    e2e = await createE2eApp()
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it('serves the public health check without a token', async () => {
    await request(server()).get(apiPath('health')).expect(200, { status: 'ok' })
  })

  it('rejects protected routes without a token', async () => {
    await request(server()).get(apiPath('participants')).expect(401)
  })

  it('logs in, returning an access token and an http-only refresh cookie', async () => {
    const response = await request(server())
      .post(apiPath('auth/login'))
      .send(E2E_ADMIN)
      .expect(200)

    expect(response.body.accessToken).toEqual(expect.any(String))
    expect(refreshCookieOf(response)).toContain('HttpOnly')
  })

  it('rejects a wrong password', async () => {
    await request(server())
      .post(apiPath('auth/login'))
      .send({ email: E2E_ADMIN.email, password: 'wrong-password' })
      .expect(401)
  })

  it('answers 401 for malformed credentials, so known emails are not revealed', async () => {
    await request(server())
      .post(apiPath('auth/login'))
      .send({ email: E2E_ADMIN.email, password: 1 })
      .expect(401)
  })

  it('returns the profile of the token holder', async () => {
    const response = await request(server())
      .get(apiPath('auth/profile'))
      .set('Authorization', `Bearer ${e2e.accessToken}`)
      .expect(200)

    expect(response.body.email).toBe(E2E_ADMIN.email)
    expect(response.body.permissions).toContain(Permission.ADMIN_CREATE)
  })

  it('refreshes the session from the refresh cookie', async () => {
    const login = await request(server())
      .post(apiPath('auth/login'))
      .send(E2E_ADMIN)
      .expect(200)

    const refreshed = await request(server())
      .post(apiPath('auth/refresh'))
      .set('Cookie', refreshCookieOf(login))
      .expect(200)

    expect(refreshed.body.accessToken).toEqual(expect.any(String))
  })

  it('does not accept an access token as a refresh token', async () => {
    await request(server())
      .post(apiPath('auth/refresh'))
      .set('Cookie', `refreshToken=${e2e.accessToken}`)
      .expect(401)
  })

  it('clears the refresh cookie on logout', async () => {
    const response = await request(server())
      .post(apiPath('auth/logout'))
      .expect(204)

    expect(refreshCookieOf(response)).toMatch(/^refreshToken=;/)
  })

  describe('session revocation (spec 002)', () => {
    const credentials = { email: 'revoke@junta.test', password: 'first-pass' }
    let adminId: string
    let currentPassword = credentials.password

    const login = async (password = currentPassword): Promise<string> =>
      refreshCookieOf(
        await request(server())
          .post(apiPath('auth/login'))
          .send({ ...credentials, password })
          .expect(200),
      )
    const refresh = (cookie: string): request.Test =>
      request(server()).post(apiPath('auth/refresh')).set('Cookie', cookie)

    beforeAll(async () => {
      const created = await asSuperAdmin(e2e)
        .post('admins', {
          ...credentials,
          roles: [Role.ADMIN],
          name: 'Rita',
          surname: 'Vega',
          phoneNumber: '622333444',
        })
        .expect(201)

      adminId = created.body.id
    })

    it('ends every session of the admin on logout', async () => {
      const laptop = await login()
      const phone = await login()

      await request(server())
        .post(apiPath('auth/logout'))
        .set('Cookie', laptop)
        .expect(204)

      await refresh(laptop).expect(401)
      await refresh(phone).expect(401)
      await refresh(await login()).expect(200)
    })

    it('ends every session of the admin when the password changes', async () => {
      const before = await login()

      await asSuperAdmin(e2e)
        .patch(`admins/${adminId}`, { password: 'second-pass' })
        .expect(200)

      currentPassword = 'second-pass'

      await refresh(before).expect(401)
      await refresh(await login()).expect(200)
    })

    it('still answers 204 to a logout with a forged cookie', async () => {
      await request(server())
        .post(apiPath('auth/logout'))
        .set('Cookie', 'refreshToken=forged')
        .expect(204)
    })

    it('still answers 204 to a logout with an expired cookie, revoking nothing', async () => {
      const session = await login()
      const expired = e2e.app
        .get(JwtService)
        .sign({ type: 'refresh', sub: adminId, ver: 0 }, { expiresIn: '-1s' })

      await request(server())
        .post(apiPath('auth/logout'))
        .set('Cookie', `refreshToken=${expired}`)
        .expect(204)

      await refresh(session).expect(200)
    })

    it('refuses cookie endpoints called from another site, so a forged form cannot log the admin out', async () => {
      const session = await login()

      await request(server())
        .post(apiPath('auth/logout'))
        .set('Origin', 'https://evil.example')
        .set('Cookie', session)
        .expect(403)
      await refresh(session).set('Origin', 'https://evil.example').expect(403)

      const allowed = e2e.app.get<AppConfig>(APP_CONFIG).corsOrigins[0]

      await refresh(session).set('Origin', allowed).expect(200)
    })
  })
})

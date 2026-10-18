import request from 'supertest'

import { Permission } from '@junta/contracts'

import { E2E_ADMIN, E2eApp, apiPath, createE2eApp } from './support/e2e-app'

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
})

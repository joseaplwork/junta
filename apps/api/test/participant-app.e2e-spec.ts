import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import {
  MyJuntaDetailResponse,
  MyJuntaSummaryResponse,
  ParticipantResponse,
  ParticipantTokensResponse,
} from '@junta/contracts'

import { E2eApp, apiPath, asSuperAdmin, createE2eApp } from './support/e2e-app'

/** Spec 003: participant accounts and the /api/me reads (BR-15). */
describe('Participant app (e2e)', () => {
  let e2e: E2eApp
  let tokens: ParticipantTokensResponse
  let participantId: string
  let juntaId: string
  let otherJuntaId: string

  const server = (): Parameters<typeof request>[0] => e2e.app.getHttpServer()
  const registration = {
    email: 'Rosa@Junta.test',
    password: 'rosa-password',
    name: 'Rosa',
    surname: 'Quispe',
    phoneNumber: '611000111',
  }
  const asParticipant = (path: string): request.Test =>
    request(server())
      .get(apiPath(path))
      .set('Authorization', `Bearer ${tokens.accessToken}`)

  beforeAll(async () => {
    e2e = await createE2eApp()

    const registered = await request(server())
      .post(apiPath('participant-auth/register'))
      .send(registration)
      .expect(201)

    tokens = registered.body
    participantId = e2e.app
      .get(JwtService)
      .decode<{ participantId: string }>(tokens.accessToken).participantId

    const admin = asSuperAdmin(e2e)
    const partner: ParticipantResponse = (
      await admin
        .post('participants', {
          name: 'Luis',
          surname: 'Mamani',
          phoneNumber: '622',
        })
        .expect(201)
    ).body
    const groupMate: ParticipantResponse = (
      await admin
        .post('participants', {
          name: 'Luz',
          surname: 'Condori',
          phoneNumber: '633',
        })
        .expect(201)
    ).body
    const junta = (amount: number, groups: string[][]): object => ({
      name: `Junta ${amount}`,
      amount,
      currency: 'PEN',
      startDate: '2026-01-15T00:00:00.000Z',
      endDate: '2026-02-15T00:00:00.000Z',
      active: true,
      groups: groups.map((participantIds, index) => ({
        order: index + 1,
        participantIds,
      })),
    })

    juntaId = (
      await admin
        .post(
          'juntas',
          junta(3000, [[partner.id], [participantId, groupMate.id]]),
        )
        .expect(201)
    ).body.id
    otherJuntaId = (
      await admin.post('juntas', junta(2000, [[partner.id]])).expect(201)
    ).body.id
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it('refuses a second account with the same email, in any case', async () => {
    await request(server())
      .post(apiPath('participant-auth/register'))
      .send({ ...registration, email: 'rosa@junta.test' })
      .expect(409)
  })

  it('keeps participants out of the admin endpoints', async () => {
    await asParticipant('participants').expect(403)
    await asParticipant('juntas').expect(403)
  })

  it('lists only the juntas the participant belongs to', async () => {
    const response = await asParticipant('me/juntas').expect(200)
    const juntas: MyJuntaSummaryResponse[] = response.body

    expect(juntas).toEqual([
      expect.objectContaining({
        id: juntaId,
        currency: 'PEN',
        payoutOrder: 2,
        payoutDate: '2026-02-15T00:00:00.000Z',
        groupAmount: 1500,
        groupSize: 2,
      }),
    ])
  })

  it("shows its own group's names and nothing else (BR-15)", async () => {
    const response = await asParticipant(`me/juntas/${juntaId}`).expect(200)
    const junta: MyJuntaDetailResponse = response.body

    expect(junta.groupMembers).toEqual([
      { name: 'Rosa', surname: 'Quispe' },
      { name: 'Luz', surname: 'Condori' },
    ])
    expect(JSON.stringify(junta)).not.toContain('611000111')
    await asParticipant(`me/juntas/${otherJuntaId}`).expect(404)
  })

  it('answers 403 to an admin token on /me', async () => {
    await asSuperAdmin(e2e).get('me/juntas').expect(403)
  })

  it('signs in case-insensitively and rejects a wrong password', async () => {
    await request(server())
      .post(apiPath('participant-auth/login'))
      .send({ email: 'ROSA@junta.test', password: 'wrong-password' })
      .expect(401)
    await request(server())
      .post(apiPath('participant-auth/login'))
      .send({ email: 'ROSA@junta.test', password: registration.password })
      .expect(200)
  })

  it('refreshes, then ends every session on logout', async () => {
    const refreshed = await request(server())
      .post(apiPath('participant-auth/refresh'))
      .send({ refreshToken: tokens.refreshToken })
      .expect(200)

    await request(server())
      .post(apiPath('participant-auth/logout'))
      .send({ refreshToken: refreshed.body.refreshToken })
      .expect(204)
    await request(server())
      .post(apiPath('participant-auth/refresh'))
      .send({ refreshToken: refreshed.body.refreshToken })
      .expect(401)
  })

  it('keeps admin and participant refresh tokens apart', async () => {
    const participant = await request(server())
      .post(apiPath('participant-auth/login'))
      .send({ email: registration.email, password: registration.password })
      .expect(200)

    await request(server())
      .post(apiPath('auth/refresh'))
      .set('Cookie', `refreshToken=${participant.body.refreshToken}`)
      .expect(401)
  })
})

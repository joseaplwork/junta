import request from 'supertest'

import { JuntaResponse, ParticipantResponse, Role } from '@junta/contracts'

import { E2eApp, apiPath, asAdmin, createE2eApp } from './support/e2e-app'

/** Spec 004: organizers manage only their own juntas and participants (BR-16). */
describe('Organizers (e2e)', () => {
  let e2e: E2eApp
  let organizerA: string
  let organizerB: string
  let juntaOfA: JuntaResponse
  let participantOfA: ParticipantResponse
  let participantOfB: ParticipantResponse

  const server = (): Parameters<typeof request>[0] => e2e.app.getHttpServer()
  const account = (email: string, roles: Role[]): object => ({
    email,
    password: 'secret-password',
    roles,
    name: email.split('@')[0],
    surname: 'Test',
    phoneNumber: '600',
  })
  const signIn = async (email: string): Promise<string> =>
    (
      await request(server())
        .post(apiPath('auth/login'))
        .send({ email, password: 'secret-password' })
        .expect(200)
    ).body.accessToken
  const as = (token: string) => ({
    get: (path: string) =>
      request(server())
        .get(apiPath(path))
        .set('Authorization', `Bearer ${token}`),
    post: (path: string, body: object) =>
      request(server())
        .post(apiPath(path))
        .set('Authorization', `Bearer ${token}`)
        .send(body),
    patch: (path: string, body: object) =>
      request(server())
        .patch(apiPath(path))
        .set('Authorization', `Bearer ${token}`)
        .send(body),
  })
  const junta = (participantIds: string[]): object => ({
    name: 'Junta A',
    amount: 2000,
    currency: 'PEN',
    startDate: '2026-01-15T00:00:00.000Z',
    endDate: '2026-02-15T00:00:00.000Z',
    active: true,
    groups: [{ order: 1, participantIds }],
  })

  beforeAll(async () => {
    e2e = await createE2eApp()

    const admin = asAdmin(e2e)

    await admin
      .post('accounts', account('a@junta.test', [Role.ORGANIZER]))
      .expect(201)
    await admin
      .post('accounts', account('b@junta.test', [Role.ORGANIZER]))
      .expect(201)
    await admin
      .post(
        'accounts',
        account('only-participant@junta.test', [Role.PARTICIPANT]),
      )
      .expect(201)

    organizerA = await signIn('a@junta.test')
    organizerB = await signIn('b@junta.test')

    participantOfA = (
      await as(organizerA)
        .post('participants', { name: 'Ana', surname: 'A', phoneNumber: '611' })
        .expect(201)
    ).body
    participantOfB = (
      await as(organizerB)
        .post('participants', {
          name: 'Beto',
          surname: 'B',
          phoneNumber: '622',
        })
        .expect(201)
    ).body
    juntaOfA = (
      await as(organizerA)
        .post('juntas', junta([participantOfA.id]))
        .expect(201)
    ).body
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it("hides another organizer's juntas", async () => {
    const list = await as(organizerB).get('juntas').expect(200)

    expect(list.body.map((item: JuntaResponse) => item.id)).not.toContain(
      juntaOfA.id,
    )
    await as(organizerB).get(`juntas/${juntaOfA.id}`).expect(404)
    await as(organizerB)
      .patch(`juntas/${juntaOfA.id}`, { name: 'Taken' })
      .expect(404)
    await as(organizerA).get(`juntas/${juntaOfA.id}`).expect(200)
  })

  it("hides another organizer's participants", async () => {
    const list = await as(organizerB).get('participants').expect(200)
    const ids = list.body.map((item: ParticipantResponse) => item.id)

    expect(ids).toContain(participantOfB.id)
    expect(ids).not.toContain(participantOfA.id)
    await as(organizerB).get(`participants/${participantOfA.id}`).expect(404)
  })

  it("refuses to put someone else's participant into a junta", async () => {
    const response = await as(organizerA)
      .post('juntas', junta([participantOfB.id]))
      .expect(400)

    expect(response.body.rule).toBe('BR-16')
  })

  it('shows admins everything', async () => {
    const list = await asAdmin(e2e).get('juntas').expect(200)

    expect(list.body.map((item: JuntaResponse) => item.id)).toContain(
      juntaOfA.id,
    )
  })

  it('leaves account management to admins', async () => {
    await as(organizerA).get('accounts').expect(403)
  })

  it('keeps participant-only accounts out of the web app but lets them use the mobile app (BR-14)', async () => {
    await request(server())
      .post(apiPath('auth/login'))
      .send({
        email: 'only-participant@junta.test',
        password: 'secret-password',
      })
      .expect(403)
    await request(server())
      .post(apiPath('mobile-auth/login'))
      .send({
        email: 'only-participant@junta.test',
        password: 'secret-password',
      })
      .expect(200)
  })
})

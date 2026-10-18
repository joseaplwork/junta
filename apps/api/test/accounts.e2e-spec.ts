import { Role } from '@junta/contracts'

import { E2eApp, asAdmin, createE2eApp } from './support/e2e-app'

describe('Accounts (e2e)', () => {
  let e2e: E2eApp
  let api: ReturnType<typeof asAdmin>

  const accountRequest = {
    email: 'luis@junta.test',
    password: 'luis-password',
    roles: [Role.ORGANIZER],
    name: 'Luis',
    surname: 'Ruiz',
    phoneNumber: '611222333',
  }

  beforeAll(async () => {
    e2e = await createE2eApp()
    api = asAdmin(e2e)
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it('creates an account without ever returning the password', async () => {
    const created = await api.post('accounts', accountRequest).expect(201)

    expect(created.body).toMatchObject({
      email: 'luis@junta.test',
      roles: [Role.ORGANIZER],
      participant: { name: 'Luis', surname: 'Ruiz' },
    })
    expect(created.body).not.toHaveProperty('password')

    const list = await api.get('accounts').expect(200)

    for (const admin of list.body) {
      expect(admin).not.toHaveProperty('password')
    }
  })

  it('answers 409 for a duplicate email', async () => {
    await api
      .post('accounts', { ...accountRequest, email: 'dup@junta.test' })
      .expect(201)
    await api
      .post('accounts', { ...accountRequest, email: 'dup@junta.test' })
      .expect(409)
  })

  it('updates roles and participant data, then deletes the account', async () => {
    const created = await api
      .post('accounts', { ...accountRequest, email: 'marta@junta.test' })
      .expect(201)

    const updated = await api
      .patch(`accounts/${created.body.id}`, {
        roles: [Role.ADMIN],
        surname: 'Lopez',
      })
      .expect(200)

    expect(updated.body.roles).toEqual([Role.ADMIN])
    expect(updated.body.participant.surname).toBe('Lopez')

    await api.delete(`accounts/${created.body.id}`).expect(204)
    await api.get(`accounts/${created.body.id}`).expect(404)
  })

  it('rejects an unknown role', async () => {
    await api
      .post('accounts', {
        ...accountRequest,
        email: 'x@junta.test',
        roles: ['root'],
      })
      .expect(400)
  })
})

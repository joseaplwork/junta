import { Role } from '@junta/contracts'

import { E2eApp, asSuperAdmin, createE2eApp } from './support/e2e-app'

describe('Admins (e2e)', () => {
  let e2e: E2eApp
  let api: ReturnType<typeof asSuperAdmin>

  const adminRequest = {
    email: 'luis@junta.test',
    password: 'luis-password',
    roles: [Role.ADMIN],
    name: 'Luis',
    surname: 'Ruiz',
    phoneNumber: '611222333',
  }

  beforeAll(async () => {
    e2e = await createE2eApp()
    api = asSuperAdmin(e2e)
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it('creates an admin without ever returning the password', async () => {
    const created = await api.post('admins', adminRequest).expect(201)

    expect(created.body).toMatchObject({
      email: 'luis@junta.test',
      roles: [Role.ADMIN],
      participant: { name: 'Luis', surname: 'Ruiz' },
    })
    expect(created.body).not.toHaveProperty('password')

    const list = await api.get('admins').expect(200)

    for (const admin of list.body) {
      expect(admin).not.toHaveProperty('password')
    }
  })

  it('answers 409 for a duplicate email', async () => {
    await api
      .post('admins', { ...adminRequest, email: 'dup@junta.test' })
      .expect(201)
    await api
      .post('admins', { ...adminRequest, email: 'dup@junta.test' })
      .expect(409)
  })

  it('updates roles and participant data, then deletes the admin', async () => {
    const created = await api
      .post('admins', { ...adminRequest, email: 'marta@junta.test' })
      .expect(201)

    const updated = await api
      .patch(`admins/${created.body.id}`, {
        roles: [Role.SUPER_ADMIN],
        surname: 'Lopez',
      })
      .expect(200)

    expect(updated.body.roles).toEqual([Role.SUPER_ADMIN])
    expect(updated.body.participant.surname).toBe('Lopez')

    await api.delete(`admins/${created.body.id}`).expect(204)
    await api.get(`admins/${created.body.id}`).expect(404)
  })

  it('rejects an unknown role', async () => {
    await api
      .post('admins', {
        ...adminRequest,
        email: 'x@junta.test',
        roles: ['root'],
      })
      .expect(400)
  })
})

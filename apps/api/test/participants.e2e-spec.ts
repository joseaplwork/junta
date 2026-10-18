import { randomUUID } from 'crypto'

import { ParticipantResponse } from '@junta/contracts'

import { E2eApp, asSuperAdmin, createE2eApp } from './support/e2e-app'

describe('Participants (e2e)', () => {
  let e2e: E2eApp
  let api: ReturnType<typeof asSuperAdmin>

  beforeAll(async () => {
    e2e = await createE2eApp()
    api = asSuperAdmin(e2e)
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it('runs the full create, read, update and delete cycle', async () => {
    const created = await api
      .post('participants', {
        name: 'Ana',
        surname: 'Diaz',
        phoneNumber: '600111222',
      })
      .expect(201)
    const participant: ParticipantResponse = created.body

    expect(participant).toEqual({
      id: expect.any(String),
      name: 'Ana',
      surname: 'Diaz',
      phoneNumber: '600111222',
    })

    await api.get(`participants/${participant.id}`).expect(200, participant)

    const updated = await api
      .patch(`participants/${participant.id}`, { phoneNumber: '699000000' })
      .expect(200)

    expect(updated.body.phoneNumber).toBe('699000000')

    const list = await api.get('participants').expect(200)

    expect(list.body).toContainEqual(updated.body)

    await api.delete(`participants/${participant.id}`).expect(204)
    await api.get(`participants/${participant.id}`).expect(404)
  })

  it('rejects missing required fields', async () => {
    await api.post('participants', { name: 'Ana' }).expect(400)
  })

  it('rejects fields that are not part of the contract', async () => {
    await api
      .post('participants', {
        name: 'Ana',
        surname: 'Diaz',
        phoneNumber: '600111222',
        isAdmin: true,
      })
      .expect(400)
  })

  it('rejects null for a required field on update', async () => {
    const created = await api
      .post('participants', { name: 'Luis', surname: 'Ruiz', phoneNumber: '1' })
      .expect(201)

    await api
      .patch(`participants/${created.body.id}`, { name: null })
      .expect(400)
  })

  it('answers 400 for a malformed id and 404 for an unknown one', async () => {
    await api.get('participants/not-a-uuid').expect(400)
    await api.get(`participants/${randomUUID()}`).expect(404)
  })
})

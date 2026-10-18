import { JuntaDetailResponse, ParticipantResponse } from '@junta/contracts'

import { E2eApp, asSuperAdmin, createE2eApp } from './support/e2e-app'

describe('Juntas (e2e)', () => {
  let e2e: E2eApp
  let api: ReturnType<typeof asSuperAdmin>
  let participants: ParticipantResponse[]

  const juntaRequest = (
    groups: { order: number; participantIds: string[] }[],
  ) => ({
    name: 'Neighbourhood junta',
    amount: 2000,
    currency: 'PEN',
    startDate: '2026-01-15T00:00:00.000Z',
    endDate: '2026-02-15T00:00:00.000Z',
    active: true,
    groups,
  })

  beforeAll(async () => {
    e2e = await createE2eApp()
    api = asSuperAdmin(e2e)
    participants = []

    for (const name of ['Ana', 'Luis', 'Marta']) {
      const response = await api
        .post('participants', {
          name,
          surname: 'Test',
          phoneNumber: '600000000',
        })
        .expect(201)

      participants.push(response.body)
    }
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it('creates scenario 2 from docs/domain.md and returns its detail', async () => {
    const [ana, luis, marta] = participants
    const created = await api
      .post(
        'juntas',
        juntaRequest([
          { order: 2, participantIds: [luis.id, marta.id] },
          { order: 1, participantIds: [ana.id] },
        ]),
      )
      .expect(201)

    expect(created.body).toMatchObject({
      currency: 'PEN',
      groupCount: 2,
      groupAmount: 1000,
    })

    const detail = await api.get(`juntas/${created.body.id}`).expect(200)
    const junta: JuntaDetailResponse = detail.body

    expect(junta.groups.map(group => group.order)).toEqual([1, 2])
    expect(junta.groups[1].members.map(member => member.name).sort()).toEqual([
      'Luis',
      'Marta',
    ])

    const juntasOfAna = await api
      .get(`participants/${ana.id}/juntas`)
      .expect(200)

    expect(juntasOfAna.body.map((j: { id: string }) => j.id)).toContain(
      junta.id,
    )
  })

  it('rejects a participant in two groups with rule BR-05', async () => {
    const [ana] = participants
    const response = await api
      .post(
        'juntas',
        juntaRequest([
          { order: 1, participantIds: [ana.id] },
          { order: 2, participantIds: [ana.id] },
        ]),
      )
      .expect(400)

    expect(response.body.rule).toBe('BR-05')
  })

  it('replaces the groups on update and deletes the junta', async () => {
    const [ana, luis, marta] = participants
    const created = await api
      .post(
        'juntas',
        juntaRequest([
          { order: 1, participantIds: [ana.id] },
          { order: 2, participantIds: [luis.id] },
        ]),
      )
      .expect(201)

    const updated = await api
      .patch(`juntas/${created.body.id}`, {
        amount: 3000,
        groups: [
          { order: 1, participantIds: [marta.id] },
          { order: 2, participantIds: [ana.id] },
          { order: 3, participantIds: [luis.id] },
        ],
      })
      .expect(200)

    expect(updated.body).toMatchObject({ groupCount: 3, groupAmount: 1000 })

    await api.delete(`juntas/${created.body.id}`).expect(204)
    await api.get(`juntas/${created.body.id}`).expect(404)
  })

  it('refuses to delete a participant that belongs to a group', async () => {
    const [ana] = participants

    await api.delete(`participants/${ana.id}`).expect(409)
  })

  it('answers 400 for a pool that does not split evenly (BR-03)', async () => {
    const [ana, luis, marta] = participants
    const response = await api
      .post('juntas', {
        ...juntaRequest([
          { order: 1, participantIds: [ana.id] },
          { order: 2, participantIds: [luis.id] },
          { order: 3, participantIds: [marta.id] },
        ]),
        endDate: '2026-03-15T00:00:00.000Z',
      })
      .expect(400)

    expect(response.body.rule).toBe('BR-03')
  })

  it('answers 400 for a currency that is not ISO 4217 (BR-13)', async () => {
    const [ana] = participants

    await api
      .post('juntas', {
        ...juntaRequest([{ order: 1, participantIds: [ana.id] }]),
        currency: 'PESOS',
      })
      .expect(400)
  })
})

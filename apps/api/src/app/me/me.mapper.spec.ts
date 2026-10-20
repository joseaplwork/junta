import { Group } from '@/api/juntas/entities/group.entity'
import { Junta } from '@/api/juntas/entities/junta.entity'
import { ParticipantGroup } from '@/api/juntas/entities/participant-group.entity'
import { Participant } from '@/api/participants/entities/participant.entity'

import { toMyJuntaDetail, toMyJuntaSummary } from './me.mapper'

const member = (id: string, name: string): ParticipantGroup =>
  Object.assign(new ParticipantGroup(), {
    participant: Object.assign(new Participant(), {
      id,
      name,
      surname: 'Test',
      phoneNumber: '600000000',
    }),
  })

const junta = Object.assign(new Junta(), {
  id: 'junta-1',
  name: 'Vuelo Peru',
  amount: 3000,
  currency: 'PEN',
  groupCount: 2,
  groupAmount: 1500,
  startDate: '2020-01-15',
  endDate: '2099-02-15',
  groups: [
    Object.assign(new Group(), {
      order: 1,
      participantGroups: [member('ana', 'Ana')],
    }),
    Object.assign(new Group(), {
      order: 2,
      participantGroups: [member('luis', 'Luis'), member('marta', 'Marta')],
    }),
  ],
})

describe('me mapper (BR-15)', () => {
  it("shows only the participant's own group, by name", () => {
    expect(toMyJuntaDetail(junta, 'marta')).toEqual({
      id: 'junta-1',
      name: 'Vuelo Peru',
      amount: 3000,
      currency: 'PEN',
      startDate: '2020-01-15',
      endDate: '2099-02-15',
      active: true,
      payoutOrder: 2,
      payoutDate: '2020-02-15',
      groupAmount: 1500,
      groupSize: 2,
      groupCount: 2,
      groupMembers: [
        { name: 'Luis', surname: 'Test' },
        { name: 'Marta', surname: 'Test' },
      ],
    })
  })

  it('leaves out the member list in the summary', () => {
    expect(toMyJuntaSummary(junta, 'ana')).not.toHaveProperty('groupMembers')
  })

  it('returns nothing for a junta the participant is not in', () => {
    expect(toMyJuntaDetail(junta, 'rita')).toBeUndefined()
  })
})

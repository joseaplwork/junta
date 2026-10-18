import { findOwnGroup } from './participant-visibility'

describe('findOwnGroup (BR-15)', () => {
  const groups = [
    { order: 1, members: [{ id: 'ana' }] },
    { order: 2, members: [{ id: 'luis' }, { id: 'marta' }] },
  ]

  it("returns only the participant's own group", () => {
    expect(findOwnGroup(groups, 'marta')?.order).toBe(2)
  })

  it('returns undefined for a non-member', () => {
    expect(findOwnGroup(groups, 'rita')).toBeUndefined()
  })
})

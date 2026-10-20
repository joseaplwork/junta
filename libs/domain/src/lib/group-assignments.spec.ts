import { GroupAssignment } from '@junta/contracts'

import { DomainRuleViolation } from './domain-rule-violation'
import { assertValidGroupAssignments } from './group-assignments'

const violationOf = (groups: GroupAssignment[]): string | undefined => {
  try {
    assertValidGroupAssignments(groups)

    return undefined
  } catch (error) {
    return error instanceof DomainRuleViolation ? error.rule : 'unexpected'
  }
}

describe('assertValidGroupAssignments', () => {
  it('accepts scenario 2 from docs/domain.md: 2 groups, 3 participants', () => {
    expect(
      violationOf([
        { order: 1, participantIds: ['p1'] },
        { order: 2, participantIds: ['p2', 'p3'] },
      ]),
    ).toBeUndefined()
  })

  it('accepts groups listed out of order', () => {
    expect(
      violationOf([
        { order: 2, participantIds: ['p1'] },
        { order: 1, participantIds: ['p2'] },
      ]),
    ).toBeUndefined()
  })

  it('rejects a junta without groups (BR-02)', () => {
    expect(violationOf([])).toBe('BR-02')
  })

  it('rejects gaps in the payout order (BR-02)', () => {
    expect(
      violationOf([
        { order: 1, participantIds: ['p1'] },
        { order: 3, participantIds: ['p2'] },
      ]),
    ).toBe('BR-02')
  })

  it('rejects repeated payout orders (BR-02)', () => {
    expect(
      violationOf([
        { order: 1, participantIds: ['p1'] },
        { order: 1, participantIds: ['p2'] },
      ]),
    ).toBe('BR-02')
  })

  it('rejects a participant in two groups (BR-05)', () => {
    expect(
      violationOf([
        { order: 1, participantIds: ['p1'] },
        { order: 2, participantIds: ['p1', 'p2'] },
      ]),
    ).toBe('BR-05')
  })
})

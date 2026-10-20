import { GroupAssignment } from '@junta/contracts'

import { DomainRuleViolation } from './domain-rule-violation'

/**
 * Validates the groups of one junta:
 * - BR-02: an empty list has no orders from 1 to n. The month span is BR-01 in junta-write.ts.
 * - BR-02: group orders are 1..n with no gaps or repeats.
 * - BR-05: a participant belongs to at most one group per junta.
 */
export function assertValidGroupAssignments(
  groups: readonly GroupAssignment[],
): void {
  if (groups.length === 0) {
    throw new DomainRuleViolation(
      'BR-02',
      'Group orders must run from 1 to n without gaps or repeats',
    )
  }

  const orders = groups.map(group => group.order).sort((a, b) => a - b)

  orders.forEach((order, index) => {
    if (order !== index + 1) {
      throw new DomainRuleViolation(
        'BR-02',
        `Group orders must run from 1 to ${groups.length} without gaps or repeats`,
      )
    }
  })

  const assigned = new Set<string>()

  for (const group of groups) {
    for (const participantId of group.participantIds) {
      if (assigned.has(participantId)) {
        throw new DomainRuleViolation(
          'BR-05',
          `Participant ${participantId} is assigned to more than one group`,
        )
      }

      assigned.add(participantId)
    }
  }
}

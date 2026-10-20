import { GroupAssignment, Role } from '@junta/contracts'

import { DomainRuleViolation } from './domain-rule-violation'
import { assertValidGroupAssignments } from './group-assignments'
import { calculateGroupAmount } from './junta-financials'
import { countJuntaMonths, isCalendarDate } from './junta-schedule'

/** The junta a create or update would save, after merging a partial update. */
export interface JuntaWrite {
  startDate: string
  endDate: string
  poolAmount: number
  groupCount: number
  /** Present when the caller is replacing the groups. */
  groups?: readonly GroupAssignment[]
}

export interface JuntaWriteContext {
  roles: readonly Role[]
  /** UTC calendar date, `YYYY-MM-DD`. */
  today: string
  operation: 'create' | 'update'
  /** The start date already stored. Required for an update. */
  storedStartDate?: string
}

/**
 * BR-01 and BR-17, then the group and pool rules. Create refuses a start date
 * of today or earlier for every role. Once the stored start date has been
 * reached, only an admin can change the junta, and no role can move the start
 * date onto today or earlier. An admin may leave an already-started start
 * date as it is.
 */
export function assertJuntaWrite(
  write: JuntaWrite,
  context: JuntaWriteContext,
): void {
  assertCalendarDate(write.startDate, 'Start date')
  assertCalendarDate(write.endDate, 'End date')
  assertStartDate(write.startDate, context)
  assertSchedule(write)

  if (write.groups) assertValidGroupAssignments(write.groups)

  calculateGroupAmount(write.poolAmount, write.groupCount)
}

/**
 * BR-17: deleting a started junta is a change. Only an admin can do it.
 * Call this after the caller has already decided the viewer owns the junta.
 */
export function assertJuntaDeletable(context: {
  roles: readonly Role[]
  today: string
  storedStartDate: string
}): void {
  if (
    hasStarted(context.storedStartDate, context.today) &&
    !isAdmin(context.roles)
  ) {
    throw new DomainRuleViolation(
      'BR-17',
      'This junta has started. Only an admin can delete it.',
    )
  }
}

function assertStartDate(startDate: string, context: JuntaWriteContext): void {
  if (context.operation === 'create') {
    if (startDate <= context.today) {
      throw new DomainRuleViolation(
        'BR-17',
        'A junta can only start after today.',
      )
    }

    return
  }

  const stored = context.storedStartDate

  if (!stored) {
    throw new Error('storedStartDate is required when updating a junta')
  }

  if (hasStarted(stored, context.today) && !isAdmin(context.roles)) {
    throw new DomainRuleViolation(
      'BR-17',
      'This junta has started. Only an admin can change it.',
    )
  }

  if (startDate !== stored && startDate <= context.today) {
    throw new DomainRuleViolation(
      'BR-17',
      'The start date has to be after today.',
    )
  }
}

function assertSchedule(write: JuntaWrite): void {
  const months = countJuntaMonths(write.startDate, write.endDate)

  if (months < 2) {
    throw new DomainRuleViolation('BR-01', 'A junta lasts at least two months.')
  }

  if (write.groupCount !== months) {
    throw new DomainRuleViolation(
      'BR-01',
      `A junta from ${write.startDate} to ${write.endDate} has ${months} months and ${write.groupCount} groups.`,
    )
  }
}

function assertCalendarDate(value: string, label: string): void {
  if (!isCalendarDate(value)) {
    throw new DomainRuleViolation(
      'BR-01',
      `${label} must be a calendar date (YYYY-MM-DD).`,
    )
  }
}

function hasStarted(startDate: string, today: string): boolean {
  return startDate <= today
}

function isAdmin(roles: readonly Role[]): boolean {
  return roles.includes(Role.ADMIN)
}

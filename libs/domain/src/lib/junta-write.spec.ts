import { Role } from '@junta/contracts'

import { DomainRuleViolation } from './domain-rule-violation'
import {
  JuntaWrite,
  JuntaWriteContext,
  assertJuntaDeletable,
  assertJuntaWrite,
} from './junta-write'

const TODAY = '2026-10-19'

const groups = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    order: index + 1,
    participantIds: [`p${index + 1}`],
  }))

const write = (overrides: Partial<JuntaWrite> = {}): JuntaWrite => ({
  startDate: '2027-01-15',
  endDate: '2027-02-15',
  poolAmount: 2000,
  groupCount: 2,
  groups: groups(2),
  ...overrides,
})

const context = (
  overrides: Partial<JuntaWriteContext> = {},
): JuntaWriteContext => ({
  roles: [Role.ORGANIZER],
  today: TODAY,
  operation: 'create',
  ...overrides,
})

describe('assertJuntaWrite (BR-01)', () => {
  it('accepts one group per month across at least two months', () => {
    expect(() => assertJuntaWrite(write(), context())).not.toThrow()
  })

  it('rejects a junta shorter than two months', () => {
    expect(() =>
      assertJuntaWrite(
        write({
          endDate: '2027-01-31',
          groupCount: 1,
          groups: groups(1),
        }),
        context(),
      ),
    ).toThrow(DomainRuleViolation)

    try {
      assertJuntaWrite(
        write({ endDate: '2027-01-31', groupCount: 1, groups: groups(1) }),
        context(),
      )
    } catch (error) {
      expect(error).toMatchObject({ rule: 'BR-01' })
    }
  })

  it('rejects a group count that differs from the month span', () => {
    expect(() =>
      assertJuntaWrite(write({ groupCount: 3, groups: groups(3) }), context()),
    ).toThrow(expect.objectContaining({ rule: 'BR-01' }))
  })

  it('rejects a pool that does not split evenly (BR-03)', () => {
    expect(() =>
      assertJuntaWrite(
        write({
          endDate: '2027-03-15',
          poolAmount: 2000,
          groupCount: 3,
          groups: groups(3),
        }),
        context(),
      ),
    ).toThrow(expect.objectContaining({ rule: 'BR-03' }))
  })
})

describe('assertJuntaWrite (BR-17)', () => {
  it('rejects a create whose start date is today or earlier', () => {
    expect(() =>
      assertJuntaWrite(write({ startDate: TODAY }), context()),
    ).toThrow(expect.objectContaining({ rule: 'BR-17' }))
    expect(() =>
      assertJuntaWrite(
        write({ startDate: TODAY }),
        context({ roles: [Role.ADMIN] }),
      ),
    ).toThrow(expect.objectContaining({ rule: 'BR-17' }))
  })

  it('lets an organizer change a junta that has not started', () => {
    expect(() =>
      assertJuntaWrite(
        write(),
        context({ operation: 'update', storedStartDate: '2027-01-15' }),
      ),
    ).not.toThrow()
  })

  it('refuses an organizer change once the start date has been reached', () => {
    expect(() =>
      assertJuntaWrite(
        write({ startDate: '2026-01-15', endDate: '2026-02-15' }),
        context({ operation: 'update', storedStartDate: '2026-01-15' }),
      ),
    ).toThrow(expect.objectContaining({ rule: 'BR-17' }))
  })

  it('lets an admin change a started junta without moving the start onto today', () => {
    expect(() =>
      assertJuntaWrite(
        write({ startDate: '2026-01-15', endDate: '2026-02-15' }),
        context({
          roles: [Role.ADMIN],
          operation: 'update',
          storedStartDate: '2026-01-15',
        }),
      ),
    ).not.toThrow()
  })

  it('refuses every role that sets the start date to today or earlier', () => {
    expect(() =>
      assertJuntaWrite(
        write({ startDate: '2026-01-01' }),
        context({
          roles: [Role.ADMIN],
          operation: 'update',
          storedStartDate: '2027-01-15',
        }),
      ),
    ).toThrow(expect.objectContaining({ rule: 'BR-17' }))
  })

  it('lets an admin move a started junta to a later start date', () => {
    expect(() =>
      assertJuntaWrite(
        write(),
        context({
          roles: [Role.ADMIN],
          operation: 'update',
          storedStartDate: '2026-01-15',
        }),
      ),
    ).not.toThrow()
  })
})

describe('assertJuntaDeletable (BR-17)', () => {
  it('lets an organizer delete a junta that has not started', () => {
    expect(() =>
      assertJuntaDeletable({
        roles: [Role.ORGANIZER],
        today: TODAY,
        storedStartDate: '2027-01-15',
      }),
    ).not.toThrow()
  })

  it('refuses an organizer delete once the junta has started', () => {
    expect(() =>
      assertJuntaDeletable({
        roles: [Role.ORGANIZER],
        today: TODAY,
        storedStartDate: TODAY,
      }),
    ).toThrow(expect.objectContaining({ rule: 'BR-17' }))
  })

  it('lets an admin delete a started junta', () => {
    expect(() =>
      assertJuntaDeletable({
        roles: [Role.ADMIN],
        today: TODAY,
        storedStartDate: '2026-01-15',
      }),
    ).not.toThrow()
  })
})

import { DomainRuleViolation } from './domain-rule-violation'
import { calculateGroupAmount } from './junta-financials'

describe('calculateGroupAmount (BR-03)', () => {
  it.each([
    { pool: 2000, groups: 2, expected: 1000 },
    { pool: 2000, groups: 4, expected: 500 },
    { pool: 2000, groups: 3, expected: 666 },
  ])(
    'splits $pool across $groups groups into $expected',
    ({ pool, groups, expected }) => {
      expect(calculateGroupAmount(pool, groups)).toBe(expected)
    },
  )

  it.each([
    { pool: 0, groups: 2 },
    { pool: 2000, groups: 0 },
    { pool: 2000.5, groups: 2 },
    { pool: -100, groups: 2 },
  ])('rejects pool $pool with $groups groups', ({ pool, groups }) => {
    expect(() => calculateGroupAmount(pool, groups)).toThrow(
      DomainRuleViolation,
    )
  })
})

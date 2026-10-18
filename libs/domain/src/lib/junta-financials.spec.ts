import { DomainRuleViolation } from './domain-rule-violation'
import {
  assertCurrencyCode,
  calculateGroupAmount,
  splitsEvenly,
} from './junta-financials'

describe('calculateGroupAmount (BR-03)', () => {
  it.each([
    { pool: 2000, groups: 2, expected: 1000 },
    { pool: 2000, groups: 4, expected: 500 },
    { pool: 3000, groups: 3, expected: 1000 },
  ])(
    'splits $pool across $groups groups into $expected',
    ({ pool, groups, expected }) => {
      expect(calculateGroupAmount(pool, groups)).toBe(expected)
    },
  )

  it('rejects a pool that does not split evenly, instead of dropping the remainder', () => {
    expect(splitsEvenly(2000, 3)).toBe(false)
    expect(() => calculateGroupAmount(2000, 3)).toThrow(DomainRuleViolation)
  })

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

describe('assertCurrencyCode (BR-13)', () => {
  it.each(['MXN', 'PEN', 'EUR', 'USD'])('accepts %s', code => {
    expect(() => assertCurrencyCode(code)).not.toThrow()
  })

  it.each(['mxn', 'XXQ', 'PESO', ''])('rejects %s', code => {
    expect(() => assertCurrencyCode(code)).toThrow(DomainRuleViolation)
  })
})

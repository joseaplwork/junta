import {
  DomainRuleViolation,
  assertPositiveInteger,
} from './domain-rule-violation'

/** True when the pool splits into equal whole amounts for every group (BR-03). */
export function splitsEvenly(poolAmount: number, groupCount: number): boolean {
  return (
    Number.isInteger(poolAmount) &&
    Number.isInteger(groupCount) &&
    groupCount > 0 &&
    poolAmount % groupCount === 0
  )
}

/**
 * BR-03: every group collects exactly the monthly pool divided by the number of
 * groups, in whole currency units. A pool that does not divide evenly is
 * rejected (owner decision, 2026-10-18).
 */
export function calculateGroupAmount(
  poolAmount: number,
  groupCount: number,
): number {
  assertPositiveInteger(poolAmount, 'BR-03', 'Pool amount')
  assertPositiveInteger(groupCount, 'BR-03', 'Group count')

  if (!splitsEvenly(poolAmount, groupCount)) {
    throw new DomainRuleViolation(
      'BR-03',
      `A pool of ${poolAmount} does not split evenly across ${groupCount} groups. Choose an amount divisible by ${groupCount}.`,
    )
  }

  return poolAmount / groupCount
}

/** BR-13: a junta's currency is an ISO 4217 code, such as MXN, PEN or EUR. */
export function assertCurrencyCode(code: string): void {
  if (
    !/^[A-Z]{3}$/.test(code) ||
    !Intl.supportedValuesOf('currency').includes(code)
  ) {
    throw new DomainRuleViolation(
      'BR-13',
      `"${code}" is not an ISO 4217 currency code.`,
    )
  }
}

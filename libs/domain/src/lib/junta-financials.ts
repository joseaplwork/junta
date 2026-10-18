import { assertPositiveInteger } from './domain-rule-violation'

/**
 * BR-03: every group collects the monthly pool divided by the number of groups.
 * The result is floored to whole currency units, which is the current behavior.
 * Open question Q-01 in docs/domain.md tracks whether remainders must be kept.
 */
export function calculateGroupAmount(
  poolAmount: number,
  groupCount: number,
): number {
  assertPositiveInteger(poolAmount, 'BR-03', 'Pool amount')
  assertPositiveInteger(groupCount, 'BR-03', 'Group count')

  return Math.floor(poolAmount / groupCount)
}

/**
 * BR-08: draws a random payout order with a Fisher-Yates shuffle.
 * Returns a new array. Pass `random` to make the draw deterministic in tests.
 */
export function shuffle<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))

    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

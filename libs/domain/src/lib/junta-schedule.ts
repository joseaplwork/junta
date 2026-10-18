/**
 * BR-01: a junta has one group per calendar month, counted from the start
 * month to the end month inclusive. Uses the dates' local calendar fields.
 */
export function countJuntaMonths(startDate: Date, endDate: Date): number {
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1

  return Math.max(0, months)
}

/**
 * BR-02: the group with payout order n receives the pool in month n. Returns
 * the same day-of-month n - 1 months after the start, clamped to shorter
 * months. Uses UTC so the result does not depend on the server's time zone.
 */
export function payoutDate(startDate: Date, order: number): Date {
  const year = startDate.getUTCFullYear()
  const month = startDate.getUTCMonth() + order - 1
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  return new Date(
    Date.UTC(
      year,
      month,
      Math.min(startDate.getUTCDate(), lastDay),
      startDate.getUTCHours(),
      startDate.getUTCMinutes(),
    ),
  )
}

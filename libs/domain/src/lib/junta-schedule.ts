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

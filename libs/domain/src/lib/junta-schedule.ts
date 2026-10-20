const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

interface CalendarDate {
  year: number
  month: number
  day: number
}

/**
 * A calendar date is `YYYY-MM-DD` with no time of day. Month and day must be
 * a real date, so `2026-02-31` is not one.
 */
export function isCalendarDate(value: string): boolean {
  return parseCalendarDate(value) !== undefined
}

/** Today's calendar date in UTC. The lock and Active both use this clock. */
export function utcToday(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10)
}

/**
 * BR-01: one group per calendar month, from the start month through the end
 * month inclusive. Returns 0 when the end month is before the start month or
 * either value is not a calendar date.
 */
export function countJuntaMonths(startDate: string, endDate: string): number {
  const start = parseCalendarDate(startDate)
  const end = parseCalendarDate(endDate)

  if (!start || !end) return 0

  const months = (end.year - start.year) * 12 + (end.month - start.month) + 1

  return Math.max(0, months)
}

/**
 * BR-02: the group with payout order n receives the pool in month n. Returns
 * the same day-of-month n - 1 months after the start, clamped to shorter
 * months, as a calendar date.
 */
export function payoutDate(startDate: string, order: number): string {
  const start = parseCalendarDate(startDate)

  if (!start) {
    throw new Error(
      `payoutDate expected a calendar date, received ${startDate}`,
    )
  }

  const monthIndex = start.month - 1 + order - 1
  const year = start.year + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()

  return formatCalendarDate(year, month, Math.min(start.day, lastDay))
}

export type JuntaPhase = 'upcoming' | 'active' | 'finished'

/**
 * Upcoming before the start date, active on the start, the end and the days
 * between, finished after the end date.
 */
export function juntaPhase(
  startDate: string,
  endDate: string,
  today: string,
): JuntaPhase {
  if (today < startDate) return 'upcoming'
  if (today > endDate) return 'finished'

  return 'active'
}

/** The junta is happening: today is the start, the end, or a day between them. */
export function isJuntaActive(
  startDate: string,
  endDate: string,
  today: string,
): boolean {
  return juntaPhase(startDate, endDate, today) === 'active'
}

function parseCalendarDate(value: string): CalendarDate | undefined {
  const match = CALENDAR_DATE.exec(value)

  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined
  }

  return { year, month, day }
}

function formatCalendarDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

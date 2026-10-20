import {
  countJuntaMonths,
  isCalendarDate,
  isJuntaActive,
  juntaPhase,
  payoutDate,
  utcToday,
} from './junta-schedule'

describe('countJuntaMonths (BR-01)', () => {
  it('counts both the start and the end month', () => {
    expect(countJuntaMonths('2026-01-15', '2026-02-15')).toBe(2)
  })

  it('returns 1 when start and end fall in the same month', () => {
    expect(countJuntaMonths('2026-05-01', '2026-05-30')).toBe(1)
  })

  it('crosses year boundaries', () => {
    expect(countJuntaMonths('2026-11-10', '2027-03-10')).toBe(5)
  })

  it('returns 0 when the end month is before the start month', () => {
    expect(countJuntaMonths('2026-06-01', '2026-04-01')).toBe(0)
  })
})

describe('payoutDate (BR-02)', () => {
  it('pays order 1 in the start month', () => {
    expect(payoutDate('2026-01-31', 1)).toBe('2026-01-31')
  })

  it('clamps to the last day of shorter months', () => {
    expect(payoutDate('2026-01-31', 2)).toBe('2026-02-28')
  })

  it('crosses into the next year', () => {
    expect(payoutDate('2026-01-31', 13)).toBe('2027-01-31')
  })
})

describe('juntaPhase', () => {
  it('is upcoming, active, then finished', () => {
    expect(juntaPhase('2026-01-15', '2026-02-15', '2026-01-14')).toBe(
      'upcoming',
    )
    expect(juntaPhase('2026-01-15', '2026-02-15', '2026-01-15')).toBe('active')
    expect(juntaPhase('2026-01-15', '2026-02-15', '2026-02-16')).toBe(
      'finished',
    )
  })
})

describe('isJuntaActive', () => {
  it('is true on the start date, the end date and the days between', () => {
    expect(isJuntaActive('2026-01-15', '2026-02-15', '2026-01-15')).toBe(true)
    expect(isJuntaActive('2026-01-15', '2026-02-15', '2026-02-01')).toBe(true)
    expect(isJuntaActive('2026-01-15', '2026-02-15', '2026-02-15')).toBe(true)
  })

  it('is false before the start and after the end', () => {
    expect(isJuntaActive('2026-01-15', '2026-02-15', '2026-01-14')).toBe(false)
    expect(isJuntaActive('2026-01-15', '2026-02-15', '2026-02-16')).toBe(false)
  })
})

describe('calendar dates', () => {
  it('accepts a real day and rejects a day that month does not have', () => {
    expect(isCalendarDate('2026-02-28')).toBe(true)
    expect(isCalendarDate('2026-02-31')).toBe(false)
    expect(isCalendarDate('2026-01-15T00:00:00.000Z')).toBe(false)
  })

  it('reads today from the UTC calendar date', () => {
    expect(utcToday(new Date('2026-10-19T23:30:00.000Z'))).toBe('2026-10-19')
  })
})

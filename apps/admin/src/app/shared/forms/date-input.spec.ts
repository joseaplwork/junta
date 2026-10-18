import { fromDateInputValue, toDateInputValue } from './date-input'

describe('date input helpers', () => {
  it('round-trips a calendar day in any time zone', () => {
    expect(toDateInputValue(fromDateInputValue('2026-01-15'))).toBe(
      '2026-01-15',
    )
  })

  it('stores local midnight', () => {
    const stored = new Date(fromDateInputValue('2026-03-01'))

    expect([stored.getFullYear(), stored.getMonth(), stored.getDate()]).toEqual(
      [2026, 2, 1],
    )
    expect(stored.getHours()).toBe(0)
  })

  it('returns an empty value for missing dates', () => {
    expect(toDateInputValue(null)).toBe('')
    expect(toDateInputValue(undefined)).toBe('')
  })
})

import { countJuntaMonths } from './junta-schedule'

describe('countJuntaMonths (BR-01)', () => {
  it('counts both the start and the end month', () => {
    expect(countJuntaMonths(new Date(2026, 0, 15), new Date(2026, 1, 15))).toBe(
      2,
    )
  })

  it('returns 1 when start and end fall in the same month', () => {
    expect(countJuntaMonths(new Date(2026, 4, 1), new Date(2026, 4, 30))).toBe(
      1,
    )
  })

  it('crosses year boundaries', () => {
    expect(
      countJuntaMonths(new Date(2026, 10, 10), new Date(2027, 2, 10)),
    ).toBe(5)
  })

  it('returns 0 when the end month is before the start month', () => {
    expect(countJuntaMonths(new Date(2026, 5, 1), new Date(2026, 3, 1))).toBe(0)
  })
})

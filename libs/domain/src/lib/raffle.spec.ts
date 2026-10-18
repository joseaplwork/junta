import { shuffle } from './raffle'

const sequence = (...values: number[]): (() => number) => {
  let call = 0

  return () => values[call++ % values.length]
}

describe('shuffle (BR-08)', () => {
  it('keeps every item exactly once', () => {
    const result = shuffle([1, 2, 3, 4, 5])

    expect([...result].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('does not mutate the input', () => {
    const input = ['a', 'b', 'c']

    shuffle(input, sequence(0))

    expect(input).toEqual(['a', 'b', 'c'])
  })

  it('is deterministic for a given random source', () => {
    expect(shuffle(['a', 'b', 'c'], sequence(0, 0))).toEqual(['b', 'c', 'a'])
  })
})

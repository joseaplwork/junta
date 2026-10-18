import { readdirSync } from 'fs'
import { join } from 'path'

import { MIGRATIONS } from './migrations'

const FILE_PATTERN = /^\d{13}-[A-Za-z][A-Za-z0-9]*\.ts$/

describe('MIGRATIONS', () => {
  it('registers every migration file, oldest first', () => {
    const files = readdirSync(join(__dirname, 'migrations'))
      .filter(file => FILE_PATTERN.test(file))
      .sort()
    const expected = files.map(file => {
      const [timestamp, name] = file.replace(/\.ts$/, '').split('-')

      return `${name}${timestamp}`
    })

    expect(MIGRATIONS.map(migration => migration.name)).toEqual(expected)
  })
})

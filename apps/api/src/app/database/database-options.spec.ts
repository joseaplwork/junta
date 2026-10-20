import { DatabaseConfig } from '@/api/config/app-config'

import { databaseOptions, postgresConnectionOptions } from './database-options'

const database: DatabaseConfig = {
  host: 'ep-pooled.neon.tech',
  migrationHost: 'ep-direct.neon.tech',
  port: 5432,
  username: 'user',
  password: 'secret',
  name: 'juntas',
  logging: false,
  ssl: true,
  channelBinding: true,
}

describe('postgresConnectionOptions', () => {
  it('uses the pooled host for runtime and the direct host for migrations', () => {
    expect(postgresConnectionOptions(database, 'runtime').host).toBe(
      'ep-pooled.neon.tech',
    )
    expect(postgresConnectionOptions(database, 'migration').host).toBe(
      'ep-direct.neon.tech',
    )
  })

  it('enables SSL and channel binding when configured', () => {
    expect(postgresConnectionOptions(database, 'runtime')).toMatchObject({
      ssl: true,
      extra: { enableChannelBinding: true },
    })
  })

  it('omits SSL when it is off, so local Postgres keeps a plain socket', () => {
    const local = { ...database, ssl: false, channelBinding: false }
    const options = postgresConnectionOptions(local, 'runtime')

    expect(options.ssl).toBeUndefined()
    expect(options.extra).toBeUndefined()
  })
})

describe('databaseOptions', () => {
  it('defaults to the runtime host for the Nest app', () => {
    const options = databaseOptions(database)

    expect(options.type).toBe('postgres')
    if (options.type === 'postgres') {
      expect(options.host).toBe('ep-pooled.neon.tech')
    }
  })

  it('uses the migration host when the CLI asks for it', () => {
    const options = databaseOptions(database, 'migration')

    expect(options.type).toBe('postgres')
    if (options.type === 'postgres') {
      expect(options.host).toBe('ep-direct.neon.tech')
    }
  })
})

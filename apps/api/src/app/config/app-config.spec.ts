import {
  Env,
  loadAppConfig,
  loadDatabaseConfig,
  parsePostgresUrl,
} from './app-config'

const requiredEnv: Env = {
  DB_USERNAME: 'user',
  DB_PASSWORD: 'secret',
  DB_NAME: 'juntas',
  JWT_SECRET: 'jwt-secret',
}

const pooledUrl =
  'postgresql://neondb_owner:s3cret@ep-cool-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const directUrl =
  'postgresql://neondb_owner:s3cret@ep-cool.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

describe('loadAppConfig', () => {
  it('applies defaults for optional variables', () => {
    const config = loadAppConfig(requiredEnv)

    expect(config.port).toBe(3000)
    expect(config.database.logging).toBe(false)
    expect(config.auth.refreshTokenTtl).toBe('7d')
  })

  it('reads explicit values', () => {
    const config = loadAppConfig({
      ...requiredEnv,
      PORT: '4000',
      DB_LOGGING: 'true',
    })

    expect(config.port).toBe(4000)
    expect(config.database.logging).toBe(true)
  })

  it.each(['DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'])(
    'fails fast when %s is missing',
    key => {
      expect(() => loadAppConfig({ ...requiredEnv, [key]: undefined })).toThrow(
        key,
      )
    },
  )

  it('reads a comma-separated list of CORS origins', () => {
    const config = loadAppConfig({
      ...requiredEnv,
      CORS_ORIGIN: 'http://localhost:4200, capacitor://localhost',
    })

    expect(config.corsOrigins).toEqual([
      'http://localhost:4200',
      'capacitor://localhost',
    ])
  })

  it('rejects a non-numeric port', () => {
    expect(() => loadAppConfig({ ...requiredEnv, PORT: 'abc' })).toThrow('PORT')
  })
})

describe('parsePostgresUrl', () => {
  it('reads host, credentials, database, and channel binding', () => {
    expect(parsePostgresUrl(pooledUrl, 'DATABASE_URL')).toEqual({
      host: 'ep-cool-pooler.us-east-2.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 's3cret',
      name: 'neondb',
      channelBinding: true,
    })
  })

  it('rejects a non-postgres URL', () => {
    expect(() =>
      parsePostgresUrl('https://example.com/db', 'DATABASE_URL'),
    ).toThrow('DATABASE_URL')
  })
})

describe('loadDatabaseConfig', () => {
  it('needs only the database variables, so the migration CLI runs without JWT_SECRET', () => {
    const { JWT_SECRET: _unused, ...databaseEnv } = requiredEnv

    expect(loadDatabaseConfig(databaseEnv).name).toBe('juntas')
  })

  it('defaults migration host to DB_HOST and leaves SSL off', () => {
    const config = loadDatabaseConfig({
      ...requiredEnv,
      DB_HOST: 'ep-pooled.neon.tech',
    })

    expect(config.host).toBe('ep-pooled.neon.tech')
    expect(config.migrationHost).toBe('ep-pooled.neon.tech')
    expect(config.ssl).toBe(false)
    expect(config.channelBinding).toBe(false)
  })

  it('reads a separate migration host, SSL, and channel binding', () => {
    const config = loadDatabaseConfig({
      ...requiredEnv,
      DB_HOST: 'ep-pooled.neon.tech',
      DB_MIGRATION_HOST: 'ep-direct.neon.tech',
      DB_SSL: 'true',
      DB_CHANNEL_BINDING: 'true',
    })

    expect(config.host).toBe('ep-pooled.neon.tech')
    expect(config.migrationHost).toBe('ep-direct.neon.tech')
    expect(config.ssl).toBe(true)
    expect(config.channelBinding).toBe(true)
  })

  it('parses Neon DATABASE_URL and DATABASE_URL_UNPOOLED into DatabaseConfig', () => {
    const config = loadDatabaseConfig({
      DATABASE_URL: pooledUrl,
      DATABASE_URL_UNPOOLED: directUrl,
    })

    expect(config).toEqual({
      host: 'ep-cool-pooler.us-east-2.aws.neon.tech',
      migrationHost: 'ep-cool.us-east-2.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 's3cret',
      name: 'neondb',
      logging: false,
      ssl: true,
      channelBinding: true,
    })
  })

  it('prefers Neon URLs over discrete DB_* fields when both are present', () => {
    const config = loadDatabaseConfig({
      ...requiredEnv,
      DB_HOST: 'localhost',
      DATABASE_URL: pooledUrl,
      DATABASE_URL_UNPOOLED: directUrl,
    })

    expect(config.host).toBe('ep-cool-pooler.us-east-2.aws.neon.tech')
    expect(config.name).toBe('neondb')
  })

  it('requires both Neon URLs when either is set', () => {
    expect(() => loadDatabaseConfig({ DATABASE_URL: pooledUrl })).toThrow(
      'DATABASE_URL_UNPOOLED',
    )
  })
})

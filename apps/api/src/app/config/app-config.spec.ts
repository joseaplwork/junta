import { Env, loadAppConfig, loadDatabaseConfig } from './app-config'

const requiredEnv: Env = {
  DB_USERNAME: 'user',
  DB_PASSWORD: 'secret',
  DB_NAME: 'juntas',
  JWT_SECRET: 'jwt-secret',
}

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

  it('rejects a non-numeric port', () => {
    expect(() => loadAppConfig({ ...requiredEnv, PORT: 'abc' })).toThrow('PORT')
  })
})

describe('loadDatabaseConfig', () => {
  it('needs only the database variables, so the migration CLI runs without JWT_SECRET', () => {
    const { JWT_SECRET: _unused, ...databaseEnv } = requiredEnv

    expect(loadDatabaseConfig(databaseEnv).name).toBe('juntas')
  })
})

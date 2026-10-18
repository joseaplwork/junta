export const APP_CONFIG = Symbol('APP_CONFIG')

export interface DatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  name: string
  synchronize: boolean
  logging: boolean
}

export interface AuthConfig {
  jwtSecret: string
  accessTokenTtl: string
  refreshTokenTtl: string
}

export interface AppConfig {
  port: number
  corsOrigin: string
  database: DatabaseConfig
  auth: AuthConfig
}

export type Env = Record<string, string | undefined>

const ENV_HELP = 'Copy apps/api/.env.example to apps/api/.env and fill it in.'

function readRequired(env: Env, key: string): string {
  const value = env[key]

  if (!value) {
    throw new Error(`Missing required environment variable ${key}. ${ENV_HELP}`)
  }

  return value
}

function readInteger(env: Env, key: string, fallback: number): number {
  const raw = env[key]

  if (raw === undefined || raw === '') {
    return fallback
  }

  const value = Number(raw)

  if (!Number.isInteger(value)) {
    throw new Error(
      `Environment variable ${key} must be an integer. ${ENV_HELP}`,
    )
  }

  return value
}

function readBoolean(env: Env, key: string, fallback: boolean): boolean {
  const raw = env[key]

  if (raw === undefined || raw === '') {
    return fallback
  }

  return raw === 'true'
}

export function loadAppConfig(env: Env): AppConfig {
  return {
    port: readInteger(env, 'PORT', 3000),
    corsOrigin: env['CORS_ORIGIN'] || 'http://localhost:4200',
    database: {
      host: env['DB_HOST'] || 'localhost',
      port: readInteger(env, 'DB_PORT', 5432),
      username: readRequired(env, 'DB_USERNAME'),
      password: readRequired(env, 'DB_PASSWORD'),
      name: readRequired(env, 'DB_NAME'),
      synchronize: readBoolean(env, 'DB_SYNCHRONIZE', false),
      logging: readBoolean(env, 'DB_LOGGING', false),
    },
    auth: {
      jwtSecret: readRequired(env, 'JWT_SECRET'),
      accessTokenTtl: env['JWT_ACCESS_TTL'] || '1m',
      refreshTokenTtl: env['JWT_REFRESH_TTL'] || '7d',
    },
  }
}

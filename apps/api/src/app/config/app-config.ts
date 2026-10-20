export const APP_CONFIG = Symbol('APP_CONFIG')

/**
 * In-memory connection shape shared by every environment. Neon supplies
 * `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct); those are
 * parsed into this shape at startup. Local Postgres without Neon URLs still
 * uses the discrete `DB_*` variables.
 */
export interface DatabaseConfig {
  host: string
  /** Direct host for migrations. Defaults to `host` when unset. */
  migrationHost: string
  port: number
  username: string
  password: string
  name: string
  logging: boolean
  /** Neon rejects non-SSL connections. Local Postgres usually leaves this off. */
  ssl: boolean
  /** Neon recommends channel binding with SSL. */
  channelBinding: boolean
}

export interface AuthConfig {
  jwtSecret: string
  accessTokenTtl: string
  refreshTokenTtl: string
}

export interface AppConfig {
  port: number
  /** Origins allowed to call the API with cookies. */
  corsOrigins: string[]
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

interface ParsedPostgresUrl {
  host: string
  port: number
  username: string
  password: string
  name: string
  channelBinding: boolean
}

/** Turns a Neon (or any) Postgres URL into discrete connection fields. */
export function parsePostgresUrl(
  raw: string,
  label: string,
): ParsedPostgresUrl {
  let parsed: URL

  try {
    parsed = new URL(raw)
  } catch {
    throw new Error(`Invalid ${label}: not a URL. ${ENV_HELP}`)
  }

  if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
    throw new Error(
      `Invalid ${label}: expected a postgres:// or postgresql:// URL. ${ENV_HELP}`,
    )
  }

  const name = decodeURIComponent(parsed.pathname.replace(/^\//, ''))

  if (!parsed.hostname || !parsed.username || !name) {
    throw new Error(
      `Invalid ${label}: host, username, and database name are required. ${ENV_HELP}`,
    )
  }

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    name,
    channelBinding: parsed.searchParams.get('channel_binding') === 'require',
  }
}

function loadDatabaseConfigFromNeonUrls(env: Env): DatabaseConfig {
  const pooled = parsePostgresUrl(
    readRequired(env, 'DATABASE_URL'),
    'DATABASE_URL',
  )
  const direct = parsePostgresUrl(
    readRequired(env, 'DATABASE_URL_UNPOOLED'),
    'DATABASE_URL_UNPOOLED',
  )

  if (pooled.name !== direct.name) {
    throw new Error(
      'DATABASE_URL and DATABASE_URL_UNPOOLED must name the same database. ' +
        ENV_HELP,
    )
  }

  if (pooled.username !== direct.username) {
    throw new Error(
      'DATABASE_URL and DATABASE_URL_UNPOOLED must use the same username. ' +
        ENV_HELP,
    )
  }

  return {
    host: pooled.host,
    migrationHost: direct.host,
    port: pooled.port,
    username: pooled.username,
    password: pooled.password,
    name: pooled.name,
    logging: readBoolean(env, 'DB_LOGGING', false),
    ssl: true,
    channelBinding: pooled.channelBinding || direct.channelBinding,
  }
}

function loadDatabaseConfigFromDiscreteFields(env: Env): DatabaseConfig {
  const host = env['DB_HOST'] || 'localhost'

  return {
    host,
    migrationHost: env['DB_MIGRATION_HOST'] || host,
    port: readInteger(env, 'DB_PORT', 5432),
    username: readRequired(env, 'DB_USERNAME'),
    password: readRequired(env, 'DB_PASSWORD'),
    name: readRequired(env, 'DB_NAME'),
    logging: readBoolean(env, 'DB_LOGGING', false),
    ssl: readBoolean(env, 'DB_SSL', false),
    channelBinding: readBoolean(env, 'DB_CHANNEL_BINDING', false),
  }
}

/**
 * Prefer Neon's `DATABASE_URL` + `DATABASE_URL_UNPOOLED` when present. Otherwise
 * read the discrete `DB_*` fields (local Postgres without `neon env pull`).
 */
export function loadDatabaseConfig(env: Env): DatabaseConfig {
  if (env['DATABASE_URL'] || env['DATABASE_URL_UNPOOLED']) {
    return loadDatabaseConfigFromNeonUrls(env)
  }

  return loadDatabaseConfigFromDiscreteFields(env)
}

export function loadAppConfig(env: Env): AppConfig {
  return {
    port: readInteger(env, 'PORT', 3000),
    corsOrigins: (env['CORS_ORIGIN'] || 'http://localhost:4200')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean),
    database: loadDatabaseConfig(env),
    auth: {
      jwtSecret: readRequired(env, 'JWT_SECRET'),
      accessTokenTtl: env['JWT_ACCESS_TTL'] || '1m',
      refreshTokenTtl: env['JWT_REFRESH_TTL'] || '7d',
    },
  }
}

import { DataSourceOptions } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

import { DatabaseConfig } from '@/api/config/app-config'

import { ENTITIES } from './entities'
import { MIGRATIONS } from './migrations'

/** Runtime uses the pooled host; migrations need the direct host on Neon. */
export type DatabasePurpose = 'runtime' | 'migration'

/**
 * Host, credentials, and TLS shared by the Nest app, the migration CLI, and
 * one-off connections such as e2e setup. The schema changes only through
 * migrations: `synchronize` is always off.
 */
export function postgresConnectionOptions(
  database: DatabaseConfig,
  purpose: DatabasePurpose,
): PostgresConnectionOptions {
  const host = purpose === 'migration' ? database.migrationHost : database.host

  return {
    type: 'postgres',
    host,
    port: database.port,
    username: database.username,
    password: database.password,
    logging: database.logging,
    logger: 'advanced-console',
    ...(database.ssl
      ? {
          ssl: true as const,
          ...(database.channelBinding
            ? { extra: { enableChannelBinding: true } }
            : {}),
        }
      : {}),
  }
}

/**
 * Connection options shared by the Nest app and the migration CLI. Pass
 * `migration` for the CLI so Neon uses the direct endpoint.
 */
export function databaseOptions(
  database: DatabaseConfig,
  purpose: DatabasePurpose = 'runtime',
): DataSourceOptions {
  const options: PostgresConnectionOptions = {
    ...postgresConnectionOptions(database, purpose),
    database: database.name,
    entities: ENTITIES,
    migrations: MIGRATIONS,
    migrationsTableName: 'migrations',
    synchronize: false,
    migrationsRun: false,
  }

  return options
}

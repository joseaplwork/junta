import { DataSourceOptions } from 'typeorm'

import { DatabaseConfig } from '@/api/config/app-config'

import { ENTITIES } from './entities'
import { MIGRATIONS } from './migrations'

/**
 * Connection options shared by the Nest app and the migration CLI. The schema
 * changes only through migrations: `synchronize` is always off.
 */
export function databaseOptions(database: DatabaseConfig): DataSourceOptions {
  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.name,
    entities: ENTITIES,
    migrations: MIGRATIONS,
    migrationsTableName: 'migrations',
    synchronize: false,
    migrationsRun: false,
    logging: database.logging,
    logger: 'advanced-console',
  }
}

import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { loadDatabaseConfig } from '@/api/config/app-config'

import { databaseOptions } from './database-options'

/**
 * Used only by the TypeORM CLI behind the `migration-*` targets of
 * `@junta/api`. Nx loads `apps/api/.env` before the command runs.
 */
export default new DataSource(databaseOptions(loadDatabaseConfig(process.env)))

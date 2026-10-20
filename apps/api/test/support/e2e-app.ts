import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { API_PREFIX } from '@junta/contracts'

import { AppModule } from '@/api/app.module'
import { APP_CONFIG, AppConfig, loadAppConfig } from '@/api/config/app-config'
import { configureApp } from '@/api/configure-app'
import { postgresConnectionOptions } from '@/api/database/database-options'
import { DEV_ADMIN, seedAdminAccount } from '@/api/database/seed-admin'

export const E2E_ADMIN = DEV_ADMIN

export interface E2eApp {
  app: INestApplication
  dataSource: DataSource
  accessToken: string
}

/**
 * Loads apps/api/.env values but always targets an `*_e2e` database. That
 * database must already exist (created once on the Neon CI branch, or locally).
 * Each run clears its schema with TypeORM, then re-applies migrations; it never
 * creates or drops the database catalog entry.
 */
function e2eConfig(): AppConfig {
  const config = loadAppConfig({ ...process.env, DB_LOGGING: 'false' })
  const name = process.env['E2E_DB_NAME'] || 'juntas_e2e'

  if (!name.endsWith('_e2e')) {
    throw new Error(
      `E2E_DB_NAME must end with "_e2e" because the suite wipes that database's schema. Got "${name}".`,
    )
  }

  return {
    ...config,
    database: { ...config.database, name },
    auth: { ...config.auth, accessTokenTtl: '15m' },
  }
}

/**
 * Confirms the e2e database is reachable. Databases are provisioned once
 * (Neon Console/SQL or local Postgres), not per run — Neon CI does not use
 * CREATE DATABASE from this suite.
 */
async function assertE2eDatabaseExists(config: AppConfig): Promise<void> {
  const probe = new DataSource({
    ...postgresConnectionOptions(config.database, 'migration'),
    database: config.database.name,
  })

  try {
    await probe.initialize()
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)

    throw new Error(
      [
        `E2E database "${config.database.name}" is missing or unreachable.`,
        'Create it once on the Neon CI branch (for example juntas_e2e and juntas_generators_e2e)',
        'or on local Postgres, then set E2E_DB_NAME. The suite no longer runs CREATE DATABASE.',
        detail,
      ].join(' '),
    )
  } finally {
    if (probe.isInitialized) {
      await probe.destroy()
    }
  }
}

/**
 * Fails with the fix when the entities describe a schema the migrations do not
 * build, before any test touches the database.
 */
export async function assertMigrationsMatchEntities(
  dataSource: DataSource,
): Promise<void> {
  const { upQueries } = await dataSource.driver.createSchemaBuilder().log()
  const missing = upQueries.map(query => query.query.trim())

  if (missing.length > 0) {
    throw new Error(
      [
        'The entities differ from the migrations. Run the pending migrations on',
        'your database, then npx nx run @junta/api:migration-generate --name=<WhatChanged>.',
        'SQL the migrations do not contain yet:',
        ...missing,
      ].join('\n'),
    )
  }
}

export const apiPath = (path: string): string => `/${API_PREFIX}/${path}`

/**
 * Boots the real AppModule on a schema built only by the migrations, with one
 * seeded super admin.
 */
export async function createE2eApp(): Promise<E2eApp> {
  const config = e2eConfig()

  await assertE2eDatabaseExists(config)

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(APP_CONFIG)
    .useValue(config)
    .compile()
  const app = moduleRef.createNestApplication()

  configureApp(app, config)
  await app.init()

  const dataSource = app.get(DataSource)

  await dataSource.dropDatabase()
  await dataSource.runMigrations({ transaction: 'each' })
  await assertMigrationsMatchEntities(dataSource)
  await seedAdminAccount(dataSource, { ...E2E_ADMIN, bcryptRounds: 4 })

  const login = await request(app.getHttpServer())
    .post(apiPath('auth/login'))
    .send(E2E_ADMIN)
    .expect(200)

  return { app, dataSource, accessToken: login.body.accessToken }
}

/** Supertest helpers that send the seeded super admin's access token. */
export function asAdmin(e2e: E2eApp): {
  get: (path: string) => request.Test
  post: (path: string, body?: object) => request.Test
  patch: (path: string, body: object) => request.Test
  delete: (path: string) => request.Test
} {
  const server = e2e.app.getHttpServer()
  const bearer = `Bearer ${e2e.accessToken}`

  return {
    get: path =>
      request(server).get(apiPath(path)).set('Authorization', bearer),
    post: (path, body) =>
      request(server)
        .post(apiPath(path))
        .set('Authorization', bearer)
        .send(body),
    patch: (path, body) =>
      request(server)
        .patch(apiPath(path))
        .set('Authorization', bearer)
        .send(body),
    delete: path =>
      request(server).delete(apiPath(path)).set('Authorization', bearer),
  }
}

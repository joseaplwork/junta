import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { API_PREFIX, Role } from '@junta/contracts'

import { Account } from '@/api/accounts/entities/account.entity'
import { AppModule } from '@/api/app.module'
import { APP_CONFIG, AppConfig, loadAppConfig } from '@/api/config/app-config'
import { configureApp } from '@/api/configure-app'
import { Participant } from '@/api/participants/entities/participant.entity'

export const E2E_ADMIN = {
  email: 'e2e-admin@junta.test',
  password: 'e2e-password',
}

export interface E2eApp {
  app: INestApplication
  dataSource: DataSource
  accessToken: string
}

/** Loads apps/api/.env values but always targets a throwaway `*_e2e` database. */
function e2eConfig(): AppConfig {
  const config = loadAppConfig({ ...process.env, DB_LOGGING: 'false' })
  const name = process.env['E2E_DB_NAME'] || 'juntas_e2e'

  if (!name.endsWith('_e2e')) {
    throw new Error(
      `E2E_DB_NAME must end with "_e2e" because the suite drops it. Got "${name}".`,
    )
  }

  return {
    ...config,
    database: { ...config.database, name },
    auth: { ...config.auth, accessTokenTtl: '15m' },
  }
}

async function ensureDatabaseExists(config: AppConfig): Promise<void> {
  const maintenance = new DataSource({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: 'postgres',
  })

  await maintenance.initialize()

  try {
    const existing: unknown[] = await maintenance.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.database.name],
    )

    if (existing.length === 0) {
      await maintenance.query(`CREATE DATABASE "${config.database.name}"`)
    }
  } finally {
    await maintenance.destroy()
  }
}

async function seedSuperAdmin(dataSource: DataSource): Promise<void> {
  const participant = await dataSource.getRepository(Participant).save({
    name: 'E2E',
    surname: 'Admin',
    phoneNumber: '000000000',
  })

  await dataSource.getRepository(Account).save({
    email: E2E_ADMIN.email,
    password: await bcrypt.hash(E2E_ADMIN.password, 4),
    roles: [Role.ADMIN],
    participant,
  })
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

  await ensureDatabaseExists(config)

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
  await seedSuperAdmin(dataSource)

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

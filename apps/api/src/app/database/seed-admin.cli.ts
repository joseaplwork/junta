import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { loadDatabaseConfig } from '@/api/config/app-config'

import { databaseOptions } from './database-options'
import { DEV_ADMIN, seedAdminAccount } from './seed-admin'

function say(line: string): void {
  process.stdout.write(`${line}\n`)
}

/**
 * One-shot: seed the e2e admin credentials into the database from apps/api/.env
 * (Neon development when DATABASE_URL is set). Run via
 * `npx nx run @junta/api:seed-admin`.
 */
async function main(): Promise<void> {
  const dataSource = new DataSource(
    databaseOptions(loadDatabaseConfig(process.env), 'migration'),
  )

  await dataSource.initialize()

  try {
    const result = await seedAdminAccount(dataSource, {
      ...DEV_ADMIN,
      bcryptRounds: 10,
    })

    if (result.created) {
      say(`Seeded admin account: ${result.email}`)
    } else {
      say(`Admin account already present: ${result.email}`)
    }
  } finally {
    await dataSource.destroy()
  }
}

void main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

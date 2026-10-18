import 'reflect-metadata'

import dataSource from './data-source'
import { MIGRATIONS } from './migrations'

const SYNC_BUILT_TABLES = ['Administrators', 'Juntas', 'Participants']

function say(line: string): void {
  process.stdout.write(`${line}\n`)
}

/**
 * One-time step for a database that schema sync built before migrations
 * existed (ADR 0005). It records InitialSchema without running it, applies
 * every later migration, then checks that the schema matches the entities.
 * Run it through `npx nx run @junta/api:migration-baseline`.
 */
async function baseline(): Promise<void> {
  await dataSource.initialize()

  try {
    // Creates the migrations table when it is missing.
    await dataSource.showMigrations()

    const runner = dataSource.createQueryRunner()

    try {
      const recorded: unknown[] = await runner.query(
        'SELECT 1 FROM migrations LIMIT 1',
      )

      if (recorded.length > 0) {
        throw new Error(
          'This database already records migrations. Run migration-run instead.',
        )
      }

      for (const table of SYNC_BUILT_TABLES) {
        if (!(await runner.hasTable(table))) {
          throw new Error(
            `Table "${table}" is missing, so schema sync did not build this database. Run migration-run instead.`,
          )
        }
      }

      const name = MIGRATIONS[0].name
      const timestamp = Number(name.match(/(\d{13})$/)?.[1])

      await runner.query(
        'INSERT INTO migrations ("timestamp", "name") VALUES ($1, $2)',
        [timestamp, name],
      )
      say(`Recorded ${name} without running it.`)
    } finally {
      await runner.release()
    }

    const applied = await dataSource.runMigrations({ transaction: 'each' })

    for (const migration of applied) say(`Applied ${migration.name}.`)

    const { upQueries } = await dataSource.driver.createSchemaBuilder().log()

    if (upQueries.length > 0) {
      throw new Error(
        [
          'The database still differs from the entities after the baseline:',
          ...upQueries.map(query => query.query.trim()),
        ].join('\n'),
      )
    }

    say('The database matches the entities.')
  } finally {
    await dataSource.destroy()
  }
}

baseline().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

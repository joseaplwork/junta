import { E2eApp, createE2eApp } from './support/e2e-app'

describe('Migrations (e2e)', () => {
  let e2e: E2eApp

  beforeAll(async () => {
    e2e = await createE2eApp()
  })

  afterAll(async () => {
    await e2e.app.close()
  })

  it('build exactly the schema the entities describe', async () => {
    const { upQueries } = await e2e.dataSource.driver
      .createSchemaBuilder()
      .log()
    const pending = upQueries.map(query => query.query.trim())

    if (pending.length > 0) {
      throw new Error(
        [
          'The entities differ from the migrations. Run the pending migrations on',
          'your database, then npx nx run @junta/api:migration-generate --name=<Name>.',
          'SQL still missing from the migrations:',
          ...pending,
        ].join('\n'),
      )
    }
  })

  it('records every migration as applied', async () => {
    const applied: { name: string }[] = await e2e.dataSource.query(
      'SELECT name FROM migrations ORDER BY id',
    )

    expect(applied.map(row => row.name)).toEqual(
      e2e.dataSource.migrations.map(migration => migration.name),
    )
  })
})

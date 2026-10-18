import {
  E2eApp,
  assertMigrationsMatchEntities,
  createE2eApp,
} from './support/e2e-app'

/**
 * `createE2eApp` already refuses to start when the migrations and entities
 * differ, so every e2e spec fails with the fix. These tests state it once.
 */
describe('Migrations (e2e)', () => {
  let e2e: E2eApp

  beforeAll(async () => {
    e2e = await createE2eApp()
  })

  afterAll(async () => {
    await e2e?.app.close()
  })

  it('build exactly the schema the entities describe', async () => {
    await expect(
      assertMigrationsMatchEntities(e2e.dataSource),
    ).resolves.toBeUndefined()
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

import { DataSource } from 'typeorm'

/** The API must not serve requests against a schema older than its entities (ADR 0005). */
export async function assertNoPendingMigrations(
  dataSource: Pick<DataSource, 'showMigrations'>,
): Promise<void> {
  if (await dataSource.showMigrations()) {
    throw new Error(
      'The database has pending migrations. Run npx nx run @junta/api:migration-run first.',
    )
  }
}

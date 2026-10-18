import { MigrationInterface, QueryRunner } from 'typeorm'

const LEGACY_TABLES = ['Payments', 'Receipts']

/**
 * Removes the Payments and Receipts tables, which predate the current model and
 * never had an entity. Both were empty and unreferenced when this migration was
 * written (Q-09 in docs/domain.md). It refuses to run where either still holds
 * rows, and `down` does not restore them.
 */
export class DropLegacyTables1792319963499 implements MigrationInterface {
  name = 'DropLegacyTables1792319963499'

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of LEGACY_TABLES) {
      if (!(await queryRunner.hasTable(table))) continue

      const [{ rows }]: { rows: number }[] = await queryRunner.query(
        `SELECT count(*)::int AS rows FROM "${table}"`,
      )

      if (rows > 0) {
        throw new Error(
          `"${table}" still has ${rows} rows. Back them up and empty the table before running this migration.`,
        )
      }
    }

    await queryRunner.query(`DROP TABLE IF EXISTS "Payments"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "Receipts"`)
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."Payments_status_enum"`,
    )
  }

  public async down(): Promise<void> {
    // The legacy tables are not part of the model, so they are not restored.
  }
}

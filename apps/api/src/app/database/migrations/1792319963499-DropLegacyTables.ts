import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Removes the Payments and Receipts tables, which predate the current model and
 * never had an entity. Both were empty and unreferenced when this migration was
 * written (Q-09 in docs/domain.md). `down` does not restore them.
 */
export class DropLegacyTables1792319963499 implements MigrationInterface {
  name = 'DropLegacyTables1792319963499'

  public async up(queryRunner: QueryRunner): Promise<void> {
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

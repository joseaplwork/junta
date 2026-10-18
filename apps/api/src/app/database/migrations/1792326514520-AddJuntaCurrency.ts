import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * BR-13: each junta stores its ISO 4217 currency. Existing juntas get MXN, the
 * currency the admin displayed until now; admins can change it when editing.
 */
export class AddJuntaCurrency1792326514520 implements MigrationInterface {
  name = 'AddJuntaCurrency1792326514520'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Juntas" ADD "currency" character(3) NOT NULL DEFAULT 'MXN'`,
    )
    await queryRunner.query(
      `ALTER TABLE "Juntas" ALTER COLUMN "currency" DROP DEFAULT`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Juntas" DROP COLUMN "currency"`)
  }
}

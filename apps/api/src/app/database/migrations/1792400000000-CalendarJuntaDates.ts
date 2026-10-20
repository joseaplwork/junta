import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Start and end are calendar dates. Existing timestamptz values become their
 * UTC calendar date. Active is derived from those dates, so the column goes.
 */
export class CalendarJuntaDates1792400000000 implements MigrationInterface {
  name = 'CalendarJuntaDates1792400000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Juntas" ALTER COLUMN "start_date" TYPE date USING ("start_date" AT TIME ZONE 'UTC')::date`,
    )
    await queryRunner.query(
      `ALTER TABLE "Juntas" ALTER COLUMN "end_date" TYPE date USING ("end_date" AT TIME ZONE 'UTC')::date`,
    )
    await queryRunner.query(`ALTER TABLE "Juntas" DROP COLUMN "active"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Juntas" ADD "active" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "Juntas" ALTER COLUMN "active" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "Juntas" ALTER COLUMN "start_date" TYPE timestamptz USING "start_date"::timestamptz`,
    )
    await queryRunner.query(
      `ALTER TABLE "Juntas" ALTER COLUMN "end_date" TYPE timestamptz USING "end_date"::timestamptz`,
    )
  }
}

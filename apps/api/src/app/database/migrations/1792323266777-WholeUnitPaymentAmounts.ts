import { MigrationInterface, QueryRunner } from 'typeorm'

const COLUMNS = [
  ['Contributions', 'amount'],
  ['Payouts', 'amount_received'],
  ['Distributions', 'amount_distributed'],
]

/**
 * Amounts are whole currency units (owner decision, 2026-10-18). Converts the
 * payment amount columns in place instead of dropping them, rounding any
 * existing value.
 */
export class WholeUnitPaymentAmounts1792323266777
  implements MigrationInterface
{
  name = 'WholeUnitPaymentAmounts1792323266777'

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [table, column] of COLUMNS) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE integer USING round("${column}")::integer`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [table, column] of COLUMNS) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE numeric(10, 2)`,
      )
    }
  }
}

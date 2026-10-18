import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAdminTokenVersion1792320664801 implements MigrationInterface {
  name = 'AddAdminTokenVersion1792320664801'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Administrators"
            ADD "token_version" integer NOT NULL DEFAULT '0'
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Administrators" DROP COLUMN "token_version"
        `)
  }
}

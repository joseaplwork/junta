import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Spec 004: one Accounts table for web and app logins, and the roles renamed.
 *
 * - Stored roles: `admin` becomes `organizer`, then `superAdmin` becomes `admin`.
 * - `Administrators` becomes `Accounts`; app accounts from `ParticipantAccounts`
 *   move into it with the `participant` role.
 * - `Juntas.admin_id` becomes `organizer_id`.
 * - `Participants.created_by` records who created a participant (BR-16).
 *
 * Everything is renamed or moved in place, so no row is lost. `down` is not
 * supported: restoring the old roles and tables would need the merged rows
 * split again by hand.
 */
export class AccountsAndOrganizers1792332052955 implements MigrationInterface {
  name = 'AccountsAndOrganizers1792332052955'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "Administrators" SET "roles" = array_to_string(ARRAY(
        SELECT CASE role WHEN 'admin' THEN 'organizer' WHEN 'superAdmin' THEN 'admin' ELSE role END
        FROM unnest(string_to_array("roles", ',')) AS role
      ), ',')
    `)
    await queryRunner.query(`ALTER TABLE "Administrators" RENAME TO "Accounts"`)
    await queryRunner.query(
      `ALTER TABLE "Accounts" ALTER COLUMN "roles" SET DEFAULT 'participant'`,
    )
    await queryRunner.query(
      `ALTER TABLE "Accounts" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `UPDATE "Accounts" SET "email" = lower(trim("email"))`,
    )
    await queryRunner.query(`
      INSERT INTO "Accounts" ("id", "email", "password", "roles", "token_version", "participant_id", "created_at")
      SELECT "id", "email", "password", 'participant', "token_version", "participant_id", "created_at"
      FROM "ParticipantAccounts"
    `)
    await queryRunner.query(`DROP TABLE "ParticipantAccounts"`)
    await queryRunner.query(
      `ALTER TABLE "Juntas" RENAME COLUMN "admin_id" TO "organizer_id"`,
    )
    await queryRunner.query(`ALTER TABLE "Participants" ADD "created_by" uuid`)

    // Foreign keys take the names TypeORM derives from the new table and columns.
    await queryRunner.query(
      `ALTER TABLE "Juntas" DROP CONSTRAINT "FK_59f817d03277df2ed159c423578"`,
    )
    await queryRunner.query(
      `ALTER TABLE "Accounts" DROP CONSTRAINT "FK_dde1fb9c7f1b40a0a92d5fb20c0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "Juntas" ADD CONSTRAINT "FK_3da2b0688e9445f05092f3aab77" FOREIGN KEY ("organizer_id") REFERENCES "Accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "Accounts" ADD CONSTRAINT "FK_ad86fe5ca8eba00b9f8510f51e2" FOREIGN KEY ("participant_id") REFERENCES "Participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(): Promise<void> {
    throw new Error(
      'AccountsAndOrganizers cannot be reverted automatically. Restore a backup taken before it ran.',
    )
  }
}

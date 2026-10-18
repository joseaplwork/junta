import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddParticipantAccounts1792327064578 implements MigrationInterface {
  name = 'AddParticipantAccounts1792327064578'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "ParticipantAccounts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "token_version" integer NOT NULL DEFAULT '0',
                "participant_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_38ca4f625bff4dafb0e0046604d" UNIQUE ("email"),
                CONSTRAINT "REL_aebe4592300137fd08472aa08c" UNIQUE ("participant_id"),
                CONSTRAINT "PK_0c0356567796ee983a8047bed66" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            ALTER TABLE "ParticipantAccounts"
            ADD CONSTRAINT "FK_aebe4592300137fd08472aa08c8" FOREIGN KEY ("participant_id") REFERENCES "Participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ParticipantAccounts" DROP CONSTRAINT "FK_aebe4592300137fd08472aa08c8"
        `)
    await queryRunner.query(`
            DROP TABLE "ParticipantAccounts"
        `)
  }
}

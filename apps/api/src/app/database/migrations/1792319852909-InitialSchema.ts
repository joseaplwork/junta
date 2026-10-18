import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1792319852909 implements MigrationInterface {
  name = 'InitialSchema1792319852909'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    await queryRunner.query(`
            CREATE TABLE "ParticipantsGroups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "participant_id" uuid NOT NULL,
                "group_id" uuid NOT NULL,
                CONSTRAINT "PK_d0592bd500534b8297dc9d4c39b" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "Participants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "surname" character varying NOT NULL,
                "phone_number" character varying NOT NULL,
                CONSTRAINT "PK_7938849a564a20e99153a744bad" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "Distributions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "payout_id" uuid NOT NULL,
                "participant_id" uuid NOT NULL,
                "junta_id" uuid NOT NULL,
                "amount_distributed" numeric(10, 2) NOT NULL,
                "distributed_date" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_918bcfbf5e7e2b453ccf542c517" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "Payouts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "group_id" uuid NOT NULL,
                "junta_id" uuid NOT NULL,
                "month" integer NOT NULL,
                "amount_received" numeric(10, 2) NOT NULL,
                "received_date" TIMESTAMP WITH TIME ZONE,
                "is_fully_paid" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_a36a9d4b1f76964f57347be5766" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "Groups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying,
                "order" integer NOT NULL,
                "junta_id" uuid NOT NULL,
                CONSTRAINT "PK_be8543c3ec161e109d124cf9498" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TYPE "public"."Contributions_status_enum" AS ENUM('pending', 'paid', 'overdue')
        `)
    await queryRunner.query(`
            CREATE TABLE "Contributions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "participant_id" uuid NOT NULL,
                "junta_id" uuid NOT NULL,
                "group_id" uuid NOT NULL,
                "month" integer NOT NULL,
                "amount" numeric(10, 2) NOT NULL,
                "paid_date" TIMESTAMP WITH TIME ZONE,
                "status" "public"."Contributions_status_enum" NOT NULL DEFAULT 'pending',
                CONSTRAINT "PK_8be3aa61662c7af2177b1879c32" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "Juntas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "amount" integer NOT NULL,
                "groups" integer NOT NULL,
                "partial_amount" integer NOT NULL,
                "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "active" boolean NOT NULL,
                "admin_id" uuid NOT NULL,
                CONSTRAINT "PK_b931c8db86febc2e617cd2f84f5" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "Administrators" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "roles" text NOT NULL DEFAULT 'admin',
                "participant_id" uuid,
                CONSTRAINT "UQ_2561d0122b5239935a327e3a535" UNIQUE ("email"),
                CONSTRAINT "REL_dde1fb9c7f1b40a0a92d5fb20c" UNIQUE ("participant_id"),
                CONSTRAINT "PK_91b880c032492d4e479d29f5cb3" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            ALTER TABLE "ParticipantsGroups"
            ADD CONSTRAINT "FK_5f9df4c9f00584c88c237d44b9b" FOREIGN KEY ("participant_id") REFERENCES "Participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "ParticipantsGroups"
            ADD CONSTRAINT "FK_487b7e6eba16631f83c738f20ea" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Distributions"
            ADD CONSTRAINT "FK_d2e2310ef2130c258d34a100222" FOREIGN KEY ("payout_id") REFERENCES "Payouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Distributions"
            ADD CONSTRAINT "FK_7176c04979df1d158ad65c40b0e" FOREIGN KEY ("participant_id") REFERENCES "Participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Distributions"
            ADD CONSTRAINT "FK_0988faa62d2b715893be15af9af" FOREIGN KEY ("junta_id") REFERENCES "Juntas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Payouts"
            ADD CONSTRAINT "FK_350b442e5f09ef6c344f308a8c0" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Payouts"
            ADD CONSTRAINT "FK_4ac1614f13d3d28ab3930eab2c9" FOREIGN KEY ("junta_id") REFERENCES "Juntas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Groups"
            ADD CONSTRAINT "FK_05fdba212a1ac73928dcc1a01a3" FOREIGN KEY ("junta_id") REFERENCES "Juntas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Contributions"
            ADD CONSTRAINT "FK_a0fb6a3bdd79abc3de3f7eb22f2" FOREIGN KEY ("participant_id") REFERENCES "Participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Contributions"
            ADD CONSTRAINT "FK_24bbad8a57c27fb3de7a4139622" FOREIGN KEY ("junta_id") REFERENCES "Juntas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Contributions"
            ADD CONSTRAINT "FK_d06ab290bb330d7058d99a685ed" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Juntas"
            ADD CONSTRAINT "FK_59f817d03277df2ed159c423578" FOREIGN KEY ("admin_id") REFERENCES "Administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "Administrators"
            ADD CONSTRAINT "FK_dde1fb9c7f1b40a0a92d5fb20c0" FOREIGN KEY ("participant_id") REFERENCES "Participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Administrators" DROP CONSTRAINT "FK_dde1fb9c7f1b40a0a92d5fb20c0"
        `)
    await queryRunner.query(`
            ALTER TABLE "Juntas" DROP CONSTRAINT "FK_59f817d03277df2ed159c423578"
        `)
    await queryRunner.query(`
            ALTER TABLE "Contributions" DROP CONSTRAINT "FK_d06ab290bb330d7058d99a685ed"
        `)
    await queryRunner.query(`
            ALTER TABLE "Contributions" DROP CONSTRAINT "FK_24bbad8a57c27fb3de7a4139622"
        `)
    await queryRunner.query(`
            ALTER TABLE "Contributions" DROP CONSTRAINT "FK_a0fb6a3bdd79abc3de3f7eb22f2"
        `)
    await queryRunner.query(`
            ALTER TABLE "Groups" DROP CONSTRAINT "FK_05fdba212a1ac73928dcc1a01a3"
        `)
    await queryRunner.query(`
            ALTER TABLE "Payouts" DROP CONSTRAINT "FK_4ac1614f13d3d28ab3930eab2c9"
        `)
    await queryRunner.query(`
            ALTER TABLE "Payouts" DROP CONSTRAINT "FK_350b442e5f09ef6c344f308a8c0"
        `)
    await queryRunner.query(`
            ALTER TABLE "Distributions" DROP CONSTRAINT "FK_0988faa62d2b715893be15af9af"
        `)
    await queryRunner.query(`
            ALTER TABLE "Distributions" DROP CONSTRAINT "FK_7176c04979df1d158ad65c40b0e"
        `)
    await queryRunner.query(`
            ALTER TABLE "Distributions" DROP CONSTRAINT "FK_d2e2310ef2130c258d34a100222"
        `)
    await queryRunner.query(`
            ALTER TABLE "ParticipantsGroups" DROP CONSTRAINT "FK_487b7e6eba16631f83c738f20ea"
        `)
    await queryRunner.query(`
            ALTER TABLE "ParticipantsGroups" DROP CONSTRAINT "FK_5f9df4c9f00584c88c237d44b9b"
        `)
    await queryRunner.query(`
            DROP TABLE "Administrators"
        `)
    await queryRunner.query(`
            DROP TABLE "Juntas"
        `)
    await queryRunner.query(`
            DROP TABLE "Contributions"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."Contributions_status_enum"
        `)
    await queryRunner.query(`
            DROP TABLE "Groups"
        `)
    await queryRunner.query(`
            DROP TABLE "Payouts"
        `)
    await queryRunner.query(`
            DROP TABLE "Distributions"
        `)
    await queryRunner.query(`
            DROP TABLE "Participants"
        `)
    await queryRunner.query(`
            DROP TABLE "ParticipantsGroups"
        `)
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1747642692126 implements MigrationInterface {
    name = 'InitDb1747642692126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_23c05c292c439d77b0de816b50" ON "category" ("name") `);
        await queryRunner.query(`CREATE TABLE "entity_item" ("id" SERIAL NOT NULL, "name" character varying, "type" character varying, "sentiment" character varying, CONSTRAINT "PK_b07d4cc784dce051654fd5ad0dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("uuid" character varying NOT NULL, "url" character varying NOT NULL, "author" character varying, "published" TIMESTAMP NOT NULL, "title" character varying, "text" text, "language" character varying, "sentiment" character varying, "highlightText" jsonb, "highlightTitle" jsonb, "highlightThreadTitle" jsonb, "rating" character varying, "crawled" TIMESTAMP NOT NULL, "updated" TIMESTAMP NOT NULL, "threadUuid" character varying, CONSTRAINT "PK_852036802b135c3f93089c85137" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "site_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8d2abf7bc39d761ca0a3a95b4d8" UNIQUE ("name"), CONSTRAINT "PK_15e1c4d33b3f5ce5e98c0114929" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "thread" ("uuid" character varying NOT NULL, "url" character varying NOT NULL, "site" character varying NOT NULL, "site_full" character varying, "section_title" character varying, "title" character varying, "title_full" character varying, "published" TIMESTAMP NOT NULL, "replies_count" integer, "participants_count" integer, "site_type" character varying, "country" character varying, "main_image" character varying, "performance_score" integer, "domain_rank" integer, "domain_rank_updated" TIMESTAMP, "social" jsonb, CONSTRAINT "PK_d8a54a4551f2846e22faed67562" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "post_categories_category" ("postUuid" character varying NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_46c101c6af5ba0ef57b9e3c3b6d" PRIMARY KEY ("postUuid", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e927ee79f1d076e6ba6d675cb4" ON "post_categories_category" ("postUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5e63f80ca58e7296d5864bd2d" ON "post_categories_category" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "post_entities_entity_item" ("postUuid" character varying NOT NULL, "entityItemId" integer NOT NULL, CONSTRAINT "PK_b997b571d51c4b1b0424d96f513" PRIMARY KEY ("postUuid", "entityItemId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_89fc64a73ad0361e3eb34b31e4" ON "post_entities_entity_item" ("postUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_fa6e0e0e4fc56351059ade4900" ON "post_entities_entity_item" ("entityItemId") `);
        await queryRunner.query(`CREATE TABLE "thread_site_categories_site_category" ("threadUuid" character varying NOT NULL, "siteCategoryId" integer NOT NULL, CONSTRAINT "PK_99e401265702a7f6f88f7d6420b" PRIMARY KEY ("threadUuid", "siteCategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_34c1474d219c116edd67cd0b06" ON "thread_site_categories_site_category" ("threadUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_98fd46375350c0f59f4b9678ee" ON "thread_site_categories_site_category" ("siteCategoryId") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_4eea200994d0aa9c0e9ed84aa79" FOREIGN KEY ("threadUuid") REFERENCES "thread"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_categories_category" ADD CONSTRAINT "FK_e927ee79f1d076e6ba6d675cb41" FOREIGN KEY ("postUuid") REFERENCES "post"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_categories_category" ADD CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_entities_entity_item" ADD CONSTRAINT "FK_89fc64a73ad0361e3eb34b31e4c" FOREIGN KEY ("postUuid") REFERENCES "post"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_entities_entity_item" ADD CONSTRAINT "FK_fa6e0e0e4fc56351059ade49009" FOREIGN KEY ("entityItemId") REFERENCES "entity_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "thread_site_categories_site_category" ADD CONSTRAINT "FK_34c1474d219c116edd67cd0b068" FOREIGN KEY ("threadUuid") REFERENCES "thread"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "thread_site_categories_site_category" ADD CONSTRAINT "FK_98fd46375350c0f59f4b9678ee2" FOREIGN KEY ("siteCategoryId") REFERENCES "site_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread_site_categories_site_category" DROP CONSTRAINT "FK_98fd46375350c0f59f4b9678ee2"`);
        await queryRunner.query(`ALTER TABLE "thread_site_categories_site_category" DROP CONSTRAINT "FK_34c1474d219c116edd67cd0b068"`);
        await queryRunner.query(`ALTER TABLE "post_entities_entity_item" DROP CONSTRAINT "FK_fa6e0e0e4fc56351059ade49009"`);
        await queryRunner.query(`ALTER TABLE "post_entities_entity_item" DROP CONSTRAINT "FK_89fc64a73ad0361e3eb34b31e4c"`);
        await queryRunner.query(`ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3"`);
        await queryRunner.query(`ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_e927ee79f1d076e6ba6d675cb41"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_4eea200994d0aa9c0e9ed84aa79"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98fd46375350c0f59f4b9678ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34c1474d219c116edd67cd0b06"`);
        await queryRunner.query(`DROP TABLE "thread_site_categories_site_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa6e0e0e4fc56351059ade4900"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89fc64a73ad0361e3eb34b31e4"`);
        await queryRunner.query(`DROP TABLE "post_entities_entity_item"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5e63f80ca58e7296d5864bd2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e927ee79f1d076e6ba6d675cb4"`);
        await queryRunner.query(`DROP TABLE "post_categories_category"`);
        await queryRunner.query(`DROP TABLE "thread"`);
        await queryRunner.query(`DROP TABLE "site_category"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "entity_item"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23c05c292c439d77b0de816b50"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}

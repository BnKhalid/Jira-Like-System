import { Migration } from '@mikro-orm/migrations';

export class Migration20241107125318_ChangeSprintPrimaryKey extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_sprint_id_foreign";`);

    this.addSql(`alter table "sprint" alter column "id" drop default;`);
    this.addSql(`alter table "sprint" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "sprint" alter column "id" drop default;`);

    this.addSql(`alter table "backlog_task" alter column "sprint_id" drop default;`);
    this.addSql(`alter table "backlog_task" alter column "sprint_id" type uuid using ("sprint_id"::text::uuid);`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "sprint" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "backlog_task" alter column "sprint_id" type text using ("sprint_id"::text);`);

    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_sprint_id_foreign";`);

    this.addSql(`alter table "sprint" alter column "id" type int using ("id"::int);`);
    this.addSql(`create sequence if not exists "sprint_id_seq";`);
    this.addSql(`select setval('sprint_id_seq', (select max("id") from "sprint"));`);
    this.addSql(`alter table "sprint" alter column "id" set default nextval('sprint_id_seq');`);

    this.addSql(`alter table "backlog_task" alter column "sprint_id" type int using ("sprint_id"::int);`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);
  }

}

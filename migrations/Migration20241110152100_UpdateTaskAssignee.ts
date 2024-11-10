import { Migration } from '@mikro-orm/migrations';

export class Migration20241110152100_UpdateTaskAssignee extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_assignee_id_foreign";`);

    this.addSql(`alter table "task" alter column "assignee_id" type varchar(255) using ("assignee_id"::varchar(255));`);
    this.addSql(`alter table "task" alter column "assignee_id" drop not null;`);
    this.addSql(`alter table "task" add constraint "task_assignee_id_foreign" foreign key ("assignee_id") references "user" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_assignee_id_foreign";`);

    this.addSql(`alter table "task" alter column "assignee_id" type varchar(255) using ("assignee_id"::varchar(255));`);
    this.addSql(`alter table "task" alter column "assignee_id" set not null;`);
    this.addSql(`alter table "task" add constraint "task_assignee_id_foreign" foreign key ("assignee_id") references "user" ("id") on update cascade;`);
  }

}

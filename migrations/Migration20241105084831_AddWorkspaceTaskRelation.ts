import { Migration } from '@mikro-orm/migrations';

export class Migration20241105084831_AddWorkspaceTaskRelation extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_user_id_foreign";`);

    this.addSql(`alter table "task" add column "workspace_id" uuid not null;`);
    this.addSql(`alter table "task" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "task" alter column "status" set default 'To Do';`);
    this.addSql(`alter table "task" add constraint "task_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "task" rename column "user_id" to "assignee_id";`);
    this.addSql(`alter table "task" add constraint "task_assignee_id_foreign" foreign key ("assignee_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "workspace_member" alter column "role" type varchar(255) using ("role"::varchar(255));`);
    this.addSql(`alter table "workspace_member" alter column "role" set default 'Member';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_assignee_id_foreign";`);
    this.addSql(`alter table "task" drop constraint "task_workspace_id_foreign";`);

    this.addSql(`alter table "task" drop column "workspace_id";`);

    this.addSql(`alter table "task" alter column "status" drop default;`);
    this.addSql(`alter table "task" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "task" rename column "assignee_id" to "user_id";`);
    this.addSql(`alter table "task" add constraint "task_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "workspace_member" alter column "role" drop default;`);
    this.addSql(`alter table "workspace_member" alter column "role" type varchar(255) using ("role"::varchar(255));`);
  }

}

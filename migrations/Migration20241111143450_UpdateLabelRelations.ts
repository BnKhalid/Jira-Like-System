import { Migration } from '@mikro-orm/migrations';

export class Migration20241111143450_UpdateLabelRelations extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "label_tasks" drop constraint "label_tasks_label_label_content_foreign";`);

    this.addSql(`alter table "label" drop constraint "label_pkey";`);

    this.addSql(`alter table "label" add column "content" varchar(255) not null, add column "workspace_id" varchar(255) not null;`);
    this.addSql(`alter table "label" add constraint "label_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "label" rename column "label_content" to "id";`);
    this.addSql(`alter table "label" add constraint "label_pkey" primary key ("id");`);

    this.addSql(`alter table "label_tasks" drop constraint "label_tasks_pkey";`);

    this.addSql(`alter table "label_tasks" rename column "label_label_content" to "label_id";`);
    this.addSql(`alter table "label_tasks" add constraint "label_tasks_label_id_foreign" foreign key ("label_id") references "label" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "label_tasks" add constraint "label_tasks_pkey" primary key ("label_id", "task_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "label" drop constraint "label_workspace_id_foreign";`);

    this.addSql(`alter table "label_tasks" drop constraint "label_tasks_label_id_foreign";`);

    this.addSql(`alter table "label" drop constraint "label_pkey";`);
    this.addSql(`alter table "label" drop column "content", drop column "workspace_id";`);

    this.addSql(`alter table "label" rename column "id" to "label_content";`);
    this.addSql(`alter table "label" add constraint "label_pkey" primary key ("label_content");`);

    this.addSql(`alter table "label_tasks" drop constraint "label_tasks_pkey";`);

    this.addSql(`alter table "label_tasks" rename column "label_id" to "label_label_content";`);
    this.addSql(`alter table "label_tasks" add constraint "label_tasks_label_label_content_foreign" foreign key ("label_label_content") references "label" ("label_content") on update cascade on delete cascade;`);
    this.addSql(`alter table "label_tasks" add constraint "label_tasks_pkey" primary key ("label_label_content", "task_id");`);
  }

}

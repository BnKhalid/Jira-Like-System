import { Migration } from '@mikro-orm/migrations';

export class Migration20241107165456_UpdateOwningRelations extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "label_tasks" ("label_label_content" varchar(255) not null, "task_id" uuid not null, constraint "label_tasks_pkey" primary key ("label_label_content", "task_id"));`);

    this.addSql(`alter table "label_tasks" add constraint "label_tasks_label_label_content_foreign" foreign key ("label_label_content") references "label" ("label_content") on update cascade on delete cascade;`);
    this.addSql(`alter table "label_tasks" add constraint "label_tasks_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "task_labels" cascade;`);

    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_task_id_foreign";`);

    this.addSql(`alter table "backlog_task" alter column "priority" type varchar(255) using ("priority"::varchar(255));`);
    this.addSql(`alter table "backlog_task" alter column "priority" set default 'Medium';`);
    this.addSql(`alter table "backlog_task" alter column "task_id" drop default;`);
    this.addSql(`alter table "backlog_task" alter column "task_id" type uuid using ("task_id"::text::uuid);`);
    this.addSql(`alter table "backlog_task" alter column "task_id" drop not null;`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "task_labels" ("task_id" uuid not null, "label_label_content" varchar(255) not null, constraint "task_labels_pkey" primary key ("task_id", "label_label_content"));`);

    this.addSql(`alter table "task_labels" add constraint "task_labels_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "task_labels" add constraint "task_labels_label_label_content_foreign" foreign key ("label_label_content") references "label" ("label_content") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "label_tasks" cascade;`);

    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_task_id_foreign";`);

    this.addSql(`alter table "backlog_task" alter column "priority" drop default;`);
    this.addSql(`alter table "backlog_task" alter column "priority" type int using ("priority"::int);`);
    this.addSql(`alter table "backlog_task" alter column "task_id" drop default;`);
    this.addSql(`alter table "backlog_task" alter column "task_id" type uuid using ("task_id"::text::uuid);`);
    this.addSql(`alter table "backlog_task" alter column "task_id" set not null;`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;`);
  }

}

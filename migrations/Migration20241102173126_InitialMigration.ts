import { Migration } from '@mikro-orm/migrations';

export class Migration20241102173126_InitialMigration extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "label" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "user" ("id" uuid not null, "name" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "phone" varchar(255) not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "task" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "type" varchar(255) not null, "status" varchar(255) not null, "summary" varchar(255) not null, "description" varchar(255) null, "user_id" uuid not null, "reporter_id" uuid null, "parent_task_id" uuid null, constraint "task_pkey" primary key ("id"));`);

    this.addSql(`create table "task_link" ("id" uuid not null, "link_type" varchar(255) not null, "source_task_id" uuid not null, "target_task_id" uuid not null, constraint "task_link_pkey" primary key ("id"));`);

    this.addSql(`create table "task_labels" ("task_id" uuid not null, "label_id" int not null, constraint "task_labels_pkey" primary key ("task_id", "label_id"));`);

    this.addSql(`create table "workspace" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "key" varchar(255) not null, constraint "workspace_pkey" primary key ("id"));`);

    this.addSql(`create table "sprint" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "goal" varchar(255) null, "start_date" timestamptz not null, "end_date" timestamptz not null, "workspace_id" uuid not null);`);

    this.addSql(`create table "backlog_task" ("id" uuid not null, "priority" int not null, "story_point_estimate" int not null, "task_id" uuid not null, "sprint_id" int not null, constraint "backlog_task_pkey" primary key ("id"));`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_unique" unique ("task_id");`);

    this.addSql(`create table "workspace_member" ("id" uuid not null, "role" varchar(255) not null, "user_id" uuid not null, "workspace_id" uuid not null, constraint "workspace_member_pkey" primary key ("id"));`);

    this.addSql(`alter table "task" add constraint "task_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "task" add constraint "task_reporter_id_foreign" foreign key ("reporter_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "task" add constraint "task_parent_task_id_foreign" foreign key ("parent_task_id") references "task" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "task_link" add constraint "task_link_source_task_id_foreign" foreign key ("source_task_id") references "task" ("id") on update cascade;`);
    this.addSql(`alter table "task_link" add constraint "task_link_target_task_id_foreign" foreign key ("target_task_id") references "task" ("id") on update cascade;`);

    this.addSql(`alter table "task_labels" add constraint "task_labels_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "task_labels" add constraint "task_labels_label_id_foreign" foreign key ("label_id") references "label" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "sprint" add constraint "sprint_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);

    this.addSql(`alter table "workspace_member" add constraint "workspace_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task_labels" drop constraint "task_labels_label_id_foreign";`);

    this.addSql(`alter table "task" drop constraint "task_user_id_foreign";`);

    this.addSql(`alter table "task" drop constraint "task_reporter_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_user_id_foreign";`);

    this.addSql(`alter table "task" drop constraint "task_parent_task_id_foreign";`);

    this.addSql(`alter table "task_link" drop constraint "task_link_source_task_id_foreign";`);

    this.addSql(`alter table "task_link" drop constraint "task_link_target_task_id_foreign";`);

    this.addSql(`alter table "task_labels" drop constraint "task_labels_task_id_foreign";`);

    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_task_id_foreign";`);

    this.addSql(`alter table "sprint" drop constraint "sprint_workspace_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";`);

    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_sprint_id_foreign";`);

    this.addSql(`drop table if exists "label" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "task" cascade;`);

    this.addSql(`drop table if exists "task_link" cascade;`);

    this.addSql(`drop table if exists "task_labels" cascade;`);

    this.addSql(`drop table if exists "workspace" cascade;`);

    this.addSql(`drop table if exists "sprint" cascade;`);

    this.addSql(`drop table if exists "backlog_task" cascade;`);

    this.addSql(`drop table if exists "workspace_member" cascade;`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20241110195540_RenameBacklogTask extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "sprint_task" ("id" varchar(255) not null, "priority" varchar(255) not null default 'Medium', "story_point_estimate" int not null, "task_id" varchar(255) null, "sprint_id" varchar(255) not null, constraint "sprint_task_pkey" primary key ("id"));`);
    this.addSql(`alter table "sprint_task" add constraint "sprint_task_task_id_unique" unique ("task_id");`);

    this.addSql(`alter table "sprint_task" add constraint "sprint_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
    this.addSql(`alter table "sprint_task" add constraint "sprint_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);

    this.addSql(`drop table if exists "backlog_task" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "backlog_task" ("id" varchar(255) not null, "priority" varchar(255) not null default 'Medium', "story_point_estimate" int not null, "task_id" varchar(255) null, "sprint_id" varchar(255) not null, constraint "backlog_task_pkey" primary key ("id"));`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_unique" unique ("task_id");`);

    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);

    this.addSql(`drop table if exists "sprint_task" cascade;`);
  }

}

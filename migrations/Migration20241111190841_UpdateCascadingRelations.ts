import { Migration } from '@mikro-orm/migrations';

export class Migration20241111190841_UpdateCascadingRelations extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_workspace_id_foreign";`);

    this.addSql(`alter table "task_link" drop constraint "task_link_source_task_id_foreign";`);
    this.addSql(`alter table "task_link" drop constraint "task_link_target_task_id_foreign";`);

    this.addSql(`alter table "sprint" drop constraint "sprint_workspace_id_foreign";`);

    this.addSql(`alter table "sprint_task" drop constraint "sprint_task_task_id_foreign";`);
    this.addSql(`alter table "sprint_task" drop constraint "sprint_task_sprint_id_foreign";`);

    this.addSql(`alter table "label" drop constraint "label_workspace_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";`);

    this.addSql(`alter table "task" add constraint "task_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "task_link" add constraint "task_link_source_task_id_foreign" foreign key ("source_task_id") references "task" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "task_link" add constraint "task_link_target_task_id_foreign" foreign key ("target_task_id") references "task" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "sprint" add constraint "sprint_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "sprint_task" alter column "task_id" type varchar(255) using ("task_id"::varchar(255));`);
    this.addSql(`alter table "sprint_task" alter column "task_id" set not null;`);
    this.addSql(`alter table "sprint_task" add constraint "sprint_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "sprint_task" add constraint "sprint_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "label" add constraint "label_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_workspace_id_foreign";`);

    this.addSql(`alter table "task_link" drop constraint "task_link_source_task_id_foreign";`);
    this.addSql(`alter table "task_link" drop constraint "task_link_target_task_id_foreign";`);

    this.addSql(`alter table "sprint" drop constraint "sprint_workspace_id_foreign";`);

    this.addSql(`alter table "sprint_task" drop constraint "sprint_task_task_id_foreign";`);
    this.addSql(`alter table "sprint_task" drop constraint "sprint_task_sprint_id_foreign";`);

    this.addSql(`alter table "label" drop constraint "label_workspace_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";`);

    this.addSql(`alter table "task" add constraint "task_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "task_link" add constraint "task_link_source_task_id_foreign" foreign key ("source_task_id") references "task" ("id") on update cascade;`);
    this.addSql(`alter table "task_link" add constraint "task_link_target_task_id_foreign" foreign key ("target_task_id") references "task" ("id") on update cascade;`);

    this.addSql(`alter table "sprint" add constraint "sprint_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "sprint_task" alter column "task_id" type varchar(255) using ("task_id"::varchar(255));`);
    this.addSql(`alter table "sprint_task" alter column "task_id" drop not null;`);
    this.addSql(`alter table "sprint_task" add constraint "sprint_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
    this.addSql(`alter table "sprint_task" add constraint "sprint_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);

    this.addSql(`alter table "label" add constraint "label_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
  }

}

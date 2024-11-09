import { Migration } from '@mikro-orm/migrations';

export class Migration20241109163547_UpdateEntitesIdType extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_assignee_id_foreign";`);
    this.addSql(`alter table "task" drop constraint "task_reporter_id_foreign";`);
    this.addSql(`alter table "task" drop constraint "task_parent_task_id_foreign";`);
    this.addSql(`alter table "task" drop constraint "task_workspace_id_foreign";`);

    this.addSql(`alter table "task_link" drop constraint "task_link_source_task_id_foreign";`);
    this.addSql(`alter table "task_link" drop constraint "task_link_target_task_id_foreign";`);

    this.addSql(`alter table "label_tasks" drop constraint "label_tasks_task_id_foreign";`);

    this.addSql(`alter table "sprint" drop constraint "sprint_workspace_id_foreign";`);

    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_task_id_foreign";`);
    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_sprint_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_user_id_foreign";`);
    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";`);

    this.addSql(`alter table "refresh_token" alter column "user_id" type text using ("user_id"::text);`);
    this.addSql(`alter table "refresh_token" alter column "token" type text using ("token"::text);`);

    this.addSql(`alter table "user" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "workspace" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "task" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "task" alter column "assignee_id" type text using ("assignee_id"::text);`);
    this.addSql(`alter table "task" alter column "reporter_id" type text using ("reporter_id"::text);`);
    this.addSql(`alter table "task" alter column "parent_task_id" type text using ("parent_task_id"::text);`);
    this.addSql(`alter table "task" alter column "workspace_id" type text using ("workspace_id"::text);`);

    this.addSql(`alter table "task_link" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "task_link" alter column "source_task_id" type text using ("source_task_id"::text);`);
    this.addSql(`alter table "task_link" alter column "target_task_id" type text using ("target_task_id"::text);`);

    this.addSql(`alter table "label_tasks" alter column "task_id" type text using ("task_id"::text);`);

    this.addSql(`alter table "sprint" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "sprint" alter column "workspace_id" type text using ("workspace_id"::text);`);

    this.addSql(`alter table "backlog_task" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "backlog_task" alter column "task_id" type text using ("task_id"::text);`);
    this.addSql(`alter table "backlog_task" alter column "sprint_id" type text using ("sprint_id"::text);`);

    this.addSql(`alter table "workspace_member" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "workspace_member" alter column "user_id" type text using ("user_id"::text);`);
    this.addSql(`alter table "workspace_member" alter column "workspace_id" type text using ("workspace_id"::text);`);

    this.addSql(`alter table "refresh_token" drop column "expires_at";`);

    this.addSql(`alter table "refresh_token" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));`);
    this.addSql(`alter table "refresh_token" alter column "token" type varchar(255) using ("token"::varchar(255));`);

    this.addSql(`alter table "user" alter column "id" type varchar(255) using ("id"::varchar(255));`);

    this.addSql(`alter table "workspace" alter column "id" type varchar(255) using ("id"::varchar(255));`);

    this.addSql(`alter table "task" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "task" alter column "assignee_id" type varchar(255) using ("assignee_id"::varchar(255));`);
    this.addSql(`alter table "task" alter column "reporter_id" type varchar(255) using ("reporter_id"::varchar(255));`);
    this.addSql(`alter table "task" alter column "parent_task_id" type varchar(255) using ("parent_task_id"::varchar(255));`);
    this.addSql(`alter table "task" alter column "workspace_id" type varchar(255) using ("workspace_id"::varchar(255));`);
    this.addSql(`alter table "task" add constraint "task_assignee_id_foreign" foreign key ("assignee_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "task" add constraint "task_reporter_id_foreign" foreign key ("reporter_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "task" add constraint "task_parent_task_id_foreign" foreign key ("parent_task_id") references "task" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "task" add constraint "task_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "task_link" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "task_link" alter column "source_task_id" type varchar(255) using ("source_task_id"::varchar(255));`);
    this.addSql(`alter table "task_link" alter column "target_task_id" type varchar(255) using ("target_task_id"::varchar(255));`);
    this.addSql(`alter table "task_link" add constraint "task_link_source_task_id_foreign" foreign key ("source_task_id") references "task" ("id") on update cascade;`);
    this.addSql(`alter table "task_link" add constraint "task_link_target_task_id_foreign" foreign key ("target_task_id") references "task" ("id") on update cascade;`);

    this.addSql(`alter table "label_tasks" alter column "task_id" type varchar(255) using ("task_id"::varchar(255));`);
    this.addSql(`alter table "label_tasks" add constraint "label_tasks_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "sprint" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "sprint" alter column "workspace_id" type varchar(255) using ("workspace_id"::varchar(255));`);
    this.addSql(`alter table "sprint" add constraint "sprint_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "backlog_task" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "backlog_task" alter column "task_id" type varchar(255) using ("task_id"::varchar(255));`);
    this.addSql(`alter table "backlog_task" alter column "sprint_id" type varchar(255) using ("sprint_id"::varchar(255));`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);

    this.addSql(`alter table "workspace_member" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "workspace_member" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));`);
    this.addSql(`alter table "workspace_member" alter column "workspace_id" type varchar(255) using ("workspace_id"::varchar(255));`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_assignee_id_foreign";`);
    this.addSql(`alter table "task" drop constraint "task_reporter_id_foreign";`);
    this.addSql(`alter table "task" drop constraint "task_parent_task_id_foreign";`);
    this.addSql(`alter table "task" drop constraint "task_workspace_id_foreign";`);

    this.addSql(`alter table "task_link" drop constraint "task_link_source_task_id_foreign";`);
    this.addSql(`alter table "task_link" drop constraint "task_link_target_task_id_foreign";`);

    this.addSql(`alter table "label_tasks" drop constraint "label_tasks_task_id_foreign";`);

    this.addSql(`alter table "sprint" drop constraint "sprint_workspace_id_foreign";`);

    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_task_id_foreign";`);
    this.addSql(`alter table "backlog_task" drop constraint "backlog_task_sprint_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_user_id_foreign";`);
    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";`);

    this.addSql(`alter table "refresh_token" add column "expires_at" date not null;`);
    this.addSql(`alter table "refresh_token" alter column "user_id" drop default;`);
    this.addSql(`alter table "refresh_token" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "refresh_token" alter column "token" drop default;`);
    this.addSql(`alter table "refresh_token" alter column "token" type uuid using ("token"::text::uuid);`);

    this.addSql(`alter table "user" alter column "id" drop default;`);
    this.addSql(`alter table "user" alter column "id" type uuid using ("id"::text::uuid);`);

    this.addSql(`alter table "workspace" alter column "id" drop default;`);
    this.addSql(`alter table "workspace" alter column "id" type uuid using ("id"::text::uuid);`);

    this.addSql(`alter table "task" alter column "id" drop default;`);
    this.addSql(`alter table "task" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "task" alter column "assignee_id" drop default;`);
    this.addSql(`alter table "task" alter column "assignee_id" type uuid using ("assignee_id"::text::uuid);`);
    this.addSql(`alter table "task" alter column "reporter_id" drop default;`);
    this.addSql(`alter table "task" alter column "reporter_id" type uuid using ("reporter_id"::text::uuid);`);
    this.addSql(`alter table "task" alter column "parent_task_id" drop default;`);
    this.addSql(`alter table "task" alter column "parent_task_id" type uuid using ("parent_task_id"::text::uuid);`);
    this.addSql(`alter table "task" alter column "workspace_id" drop default;`);
    this.addSql(`alter table "task" alter column "workspace_id" type uuid using ("workspace_id"::text::uuid);`);
    this.addSql(`alter table "task" add constraint "task_assignee_id_foreign" foreign key ("assignee_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "task" add constraint "task_reporter_id_foreign" foreign key ("reporter_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "task" add constraint "task_parent_task_id_foreign" foreign key ("parent_task_id") references "task" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "task" add constraint "task_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "task_link" alter column "id" drop default;`);
    this.addSql(`alter table "task_link" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "task_link" alter column "source_task_id" drop default;`);
    this.addSql(`alter table "task_link" alter column "source_task_id" type uuid using ("source_task_id"::text::uuid);`);
    this.addSql(`alter table "task_link" alter column "target_task_id" drop default;`);
    this.addSql(`alter table "task_link" alter column "target_task_id" type uuid using ("target_task_id"::text::uuid);`);
    this.addSql(`alter table "task_link" add constraint "task_link_source_task_id_foreign" foreign key ("source_task_id") references "task" ("id") on update cascade;`);
    this.addSql(`alter table "task_link" add constraint "task_link_target_task_id_foreign" foreign key ("target_task_id") references "task" ("id") on update cascade;`);

    this.addSql(`alter table "label_tasks" alter column "task_id" drop default;`);
    this.addSql(`alter table "label_tasks" alter column "task_id" type uuid using ("task_id"::text::uuid);`);
    this.addSql(`alter table "label_tasks" add constraint "label_tasks_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "sprint" alter column "id" drop default;`);
    this.addSql(`alter table "sprint" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "sprint" alter column "workspace_id" drop default;`);
    this.addSql(`alter table "sprint" alter column "workspace_id" type uuid using ("workspace_id"::text::uuid);`);
    this.addSql(`alter table "sprint" add constraint "sprint_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "backlog_task" alter column "id" drop default;`);
    this.addSql(`alter table "backlog_task" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "backlog_task" alter column "task_id" drop default;`);
    this.addSql(`alter table "backlog_task" alter column "task_id" type uuid using ("task_id"::text::uuid);`);
    this.addSql(`alter table "backlog_task" alter column "sprint_id" drop default;`);
    this.addSql(`alter table "backlog_task" alter column "sprint_id" type uuid using ("sprint_id"::text::uuid);`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
    this.addSql(`alter table "backlog_task" add constraint "backlog_task_sprint_id_foreign" foreign key ("sprint_id") references "sprint" ("id") on update cascade;`);

    this.addSql(`alter table "workspace_member" alter column "id" drop default;`);
    this.addSql(`alter table "workspace_member" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "workspace_member" alter column "user_id" drop default;`);
    this.addSql(`alter table "workspace_member" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "workspace_member" alter column "workspace_id" drop default;`);
    this.addSql(`alter table "workspace_member" alter column "workspace_id" type uuid using ("workspace_id"::text::uuid);`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
  }

}

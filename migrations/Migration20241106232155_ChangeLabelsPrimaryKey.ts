import { Migration } from '@mikro-orm/migrations';

export class Migration20241106232155_ChangeLabelsPrimaryKey extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task_labels" drop constraint "task_labels_label_id_foreign";`);

    this.addSql(`alter table "label" drop constraint "label_pkey";`);
    this.addSql(`alter table "label" drop column "id";`);

    this.addSql(`alter table "label" rename column "name" to "label_content";`);
    this.addSql(`alter table "label" add constraint "label_pkey" primary key ("label_content");`);

    this.addSql(`alter table "task_labels" drop constraint "task_labels_pkey";`);
    this.addSql(`alter table "task_labels" drop column "label_id";`);

    this.addSql(`alter table "task_labels" add column "label_label_content" varchar(255) not null;`);
    this.addSql(`alter table "task_labels" add constraint "task_labels_label_label_content_foreign" foreign key ("label_label_content") references "label" ("label_content") on update cascade on delete cascade;`);
    this.addSql(`alter table "task_labels" add constraint "task_labels_pkey" primary key ("task_id", "label_label_content");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task_labels" drop constraint "task_labels_label_label_content_foreign";`);

    this.addSql(`alter table "label" drop constraint "label_pkey";`);

    this.addSql(`alter table "label" add column "id" serial;`);
    this.addSql(`alter table "label" rename column "label_content" to "name";`);
    this.addSql(`alter table "label" add constraint "label_pkey" primary key ("id");`);

    this.addSql(`alter table "task_labels" drop constraint "task_labels_pkey";`);
    this.addSql(`alter table "task_labels" drop column "label_label_content";`);

    this.addSql(`alter table "task_labels" add column "label_id" int not null;`);
    this.addSql(`alter table "task_labels" add constraint "task_labels_label_id_foreign" foreign key ("label_id") references "label" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "task_labels" add constraint "task_labels_pkey" primary key ("task_id", "label_id");`);
  }

}

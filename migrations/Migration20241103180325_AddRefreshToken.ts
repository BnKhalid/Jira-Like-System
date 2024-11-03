import { Migration } from '@mikro-orm/migrations';

export class Migration20241103180325_AddRefreshToken extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "refresh_token" ("user_id" uuid not null, "token" uuid not null, "expires_at" date not null, constraint "refresh_token_pkey" primary key ("user_id"));`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_token_unique" unique ("token");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "refresh_token" cascade;`);
  }

}

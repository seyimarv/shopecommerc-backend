import { Migration } from '@mikro-orm/migrations';

export class Migration20250409214615 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "restock_event" drop constraint if exists "restock_event_product_id_sales_channel_id_unique";`);
    this.addSql(`create table if not exists "restock_event" ("id" text not null, "product_id" text not null, "sales_channel_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "restock_event_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_restock_event_deleted_at" ON "restock_event" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_restock_event_product_id_sales_channel_id_unique" ON "restock_event" (product_id, sales_channel_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "restock_event" cascade;`);
  }

}

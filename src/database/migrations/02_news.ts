import * as Knex from 'knex';

import { TableName } from '../tablename';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(TableName.NEWS, (t) => {
    t.integer('id').notNullable().unique().primary();
    t.text('title').notNullable();
    t.text('body').notNullable();
    t.text('status').notNullable();
    t.integer('topic_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TableName.TOPIC)
      .onDelete('CASCADE')
      .index();
    t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists(TableName.NEWS);
}

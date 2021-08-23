import * as Knex from 'knex';

import { TableName } from '../tablename';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(TableName.TOPIC, (t) => {
    t.integer('id').notNullable().unique().primary();
    t.text('topic_name').notNullable().unique();
    t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists(TableName.TOPIC);
}

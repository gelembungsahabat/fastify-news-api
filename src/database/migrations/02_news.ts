import * as Knex from 'knex';

import { TableName } from '../tablename';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(TableName.NEWS, (t) => {
    t.integer('id').notNullable().unique().primary();
    t.text('title').notNullable();
    t.text('body').notNullable();
    t.enu('status', ['draft', 'publish', 'deleted'], {
      useNative: true,
      enumName: 'status'
    }).notNullable();
    t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists(TableName.NEWS).raw(`DROP TYPE status;`);
}

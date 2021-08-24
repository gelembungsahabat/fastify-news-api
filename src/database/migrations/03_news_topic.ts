import * as Knex from 'knex';

import { TableName } from '../tablename';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(TableName.NEWS_TOPIC, (t) => {
    t.integer('id').notNullable().unique().primary();
    t.integer('topic_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TableName.TOPIC)
      .onDelete('CASCADE')
      .index();
    t.integer('news_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(TableName.NEWS)
      .onDelete('CASCADE')
      .index();
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists(TableName.NEWS_TOPIC);
}

import * as Knex from 'knex';

const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/fastify_api?schema=public';
type ConnectionConfigType = {
  connectionString: string;
  ssl?: {
    rejectUnauthorized: boolean;
  };
};

const connectionConfig: ConnectionConfigType = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

if (!['staging', 'production'].includes(NODE_ENV)) {
  delete connectionConfig.ssl;
}

const config: Knex.Config = {
  client: 'pg',
  connection: connectionConfig,
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts'
  }
};

export default config;

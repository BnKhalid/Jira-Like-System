import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const config: Options = {
  driver: PostgreSqlDriver,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  migrations: {
    path: './migrations',
    snapshot: true,
    emit: 'ts',
  },
  debug: true,
  highlighter: new SqlHighlighter(),
};

export default config;
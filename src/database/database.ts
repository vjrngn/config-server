import { createConnection, Connection } from 'typeorm';
require('dotenv').config();

export function connect (config: any): Promise<Connection> {
  const { APP_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } =
    config;
  return createConnection({
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT!),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [__dirname, '../entities/*.ts'],
    logging: APP_ENV === 'dev'
  });
}

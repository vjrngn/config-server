import { join } from 'path';
import { createConnection, Connection } from 'typeorm';
import { ApplicationConfiguration } from '../config/config';

export function connect (config: ApplicationConfiguration): Promise<Connection> {
  const {
    database: { host, port, username, password, name },
    environment
  } = config;
  return createConnection({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database: name,
    entities: [join(__dirname, '../entities/*.ts')],
    logging: environment === 'dev'
  });
}

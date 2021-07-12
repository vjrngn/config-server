import { StartedTestContainer } from 'testcontainers';
import { Connection, createConnection } from 'typeorm';
import { join } from 'path';

const PROJECT_ROOT = join(__dirname, '..', '..');

export function connect (container: StartedTestContainer): Promise<Connection> {
  return createConnection({
    type: 'postgres',
    host: container.getHost(),
    port: container.getMappedPort(5432),
    username: 'postgres',
    password: 'password',
    database: 'test',
    migrations: [join(PROJECT_ROOT, 'migrations/*.ts')],
    entities: [join(PROJECT_ROOT, 'src', 'entities/*.ts')]
  });
}

---
to: test/repositories/<%= h.changeCase.paramCase(entity).toLowerCase() %>-repository.test.ts
---
import { expect } from 'chai';
import { connect } from '../utils/utils';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Connection, getConnection } from 'typeorm';
import { <%= entity %>Repository } from '../../src/repositories/<%= h.changeCase.paramCase(entity).toLowerCase() %>-repository'

describe('<%= entity %>Repository', function () {
  let databaseConnection: Connection;
  let postgresContainer: StartedTestContainer;
  let repository: <%= entity %>Repository;

  before(function () {
    return new GenericContainer('postgres:13')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_USER', 'postgres')
      .withEnv('POSTGRES_PASSWORD', 'password')
      .withEnv('POSTGRES_DB', 'test')
      .start()
      .then((startedContainer) => {
        postgresContainer = startedContainer;
        return connect(postgresContainer);
      })
      .then((connection: Connection) => {
        databaseConnection = connection;
        return connection.runMigrations();
      }).then(() => {
        repository = getConnection().getCustomRepository(<%= entity %>Repository);
      });
  });

  after(function () {
    return postgresContainer.stop().then(() => databaseConnection.close());
  });
});

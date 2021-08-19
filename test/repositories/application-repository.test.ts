import { expect } from 'chai';
import { connect } from '../utils/utils';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Connection, getConnection } from 'typeorm';
import { ApplicationRepository } from '../../src/repositories/application-repository';
import { ApplicationEnvironment } from '../../src/entities/ApplicationEnvironment';
import { Application } from '../../src/entities/Application';

describe('ApplicationRepository', function () {
  let databaseConnection: Connection;
  let postgresContainer: StartedTestContainer;
  let repository: ApplicationRepository;

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
      })
      .then(() => {
        repository = getConnection().getCustomRepository(ApplicationRepository);
      });
  });

  after(function () {
    return postgresContainer.stop().then(() => databaseConnection.close());
  });

  beforeEach(async () => {
    await repository.manager.transaction(async (entityManager) => {
      await entityManager.clear(ApplicationEnvironment);
      await entityManager.clear(Application);
    });
  });

  it('allows a team to create a new application', async function () {
    const result = await repository.createApplication({
      teamId: 'some-team-id',
      name: 'Todo App'
    });

    expect(result.data!.id).to.not.be.undefined;
    expect(result.data!.name).to.equal('Todo App');
    expect(result.data!.environments).to.be.empty;

    expect(await repository.find()).to.have.length(1);
  });

  it('adds environments during application creation', async function () {
    const result = await repository.createApplication({
      teamId: 'some-team-id',
      name: 'Todo App',
      environments: [{
        name: 'staging'
      }, {
        name: 'production'
      }]
    });

    const persistedEnvironments = await repository.manager.find(ApplicationEnvironment, {
      where: {
        application_id: result.data!.id
      }
    });
    expect(persistedEnvironments).to.have.length(2);
    result.data!.environments.forEach(env => {
      expect(env).to.be.instanceOf(ApplicationEnvironment);
    });
  });

  it('returns error when a team creates a duplicate application', async function () {
    // Given an application exists for a team
    const firstResult = await repository.createApplication({
      teamId: 'some-team-id',
      name: 'Todo App'
    });

    // should throw when a new one with the same name is created
    const secondResult = await repository.createApplication({
      teamId: 'some-team-id',
      name: 'Todo App'
    });

    expect(firstResult.error).to.be.null;
    expect(secondResult.data).to.be.null;
    expect(secondResult.error?.message).to.not.equal('');
  });
});

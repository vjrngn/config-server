import { expect } from 'chai';
// @ts-ignore
import { connect } from '../utils/utils';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Connection, getConnection } from 'typeorm';
import { ApplicationRepository } from '../../src/repositories/application-repository';
import { ApplicationEnvironment } from '../../src/entities/ApplicationEnvironment';
import { Application } from '../../src/entities/Application';
import moment from 'moment';

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

  describe('Application Creation', function () {
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
        environments: [
          {
            name: 'staging'
          },
          {
            name: 'production'
          }
        ]
      });

      const persistedEnvironments = await repository.manager.find(
        ApplicationEnvironment,
        {
          where: {
            application_id: result.data!.id
          }
        }
      );
      expect(persistedEnvironments).to.have.length(2);
      result.data!.environments.forEach((env) => {
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

  describe('Application Updates', function() {
    it('updates application name', async function () {
      const result = await await repository.createApplication({
        name: 'some name',
        teamId: 'team-id'
      });
      const existingApp = result.data!;
      const existingAppId = existingApp.id;
      const updateResult = await repository.updateApplication({
        id: existingAppId,
        name: 'new name'
      });

      const updatedApp = updateResult.data!;

      expect(updatedApp.name).to.equal('new name');
      const updatedRecord = await repository.manager.findOne(Application, {
        where: {
          id: existingAppId
        }
      });
      expect(moment(updatedRecord!.updated_at).isAfter(existingApp.updated_at)).to
        .be.true;
    });

    it('should return error when updating an application that does not exist', async function () {
      const result = await repository.updateApplication({
        id: 'some-id',
        name: 'new name'
      });

      expect(result.data).to.be.null;
      expect(result.error).to.not.be.null;
    });

    it('should return error if app name is empty', async function () {
      const result = await repository.updateApplication({
        id: 'some-id',
        name: ' '
      });

      expect(result.data).to.be.null;
      expect(result.error!.message).to.equal('name is required');
    });
  });
});

import expect from 'expect';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Connection, getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { Application } from '../../src/entities/Application';
import { ApplicationEnvironment } from '../../src/entities/ApplicationEnvironment';
import { Configuration } from '../../src/entities/Configuration';
import { Team } from '../../src/entities/Team';
import { ApplicationRepository } from '../../src/repositories/application-repository';
import { ConfigurationRepository } from '../../src/repositories/configuration-repository';
import { ConfigDataTypes } from '../../src/repositories/enum/config-data-types';
import { Result } from '../../src/result';
import { connect } from '../utils/utils';

describe('ConfigurationRepository', function () {
  let databaseConnection: Connection;
  let postgresContainer: StartedTestContainer;
  let repository: ConfigurationRepository;
  let applicationRepository: ApplicationRepository;

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
        repository = getConnection().getCustomRepository(ConfigurationRepository);
        applicationRepository = getConnection().getCustomRepository(ApplicationRepository);
      });
  });

  after(function () {
    return postgresContainer.stop().then(() => databaseConnection.close());
  });

  beforeEach(async () => {
    await repository.manager.transaction(async (entityManager) => {
      // Since teams is the starting point for all realtions, 
      // foreign key constraints ensure all records in dependent tables
      // are deleted.
      await entityManager.delete(Team, {});
    });
  });

  async function createTeam(): Promise<Team> {
    return repository.manager.save(Team, {
      id: v4(),
      name: 'test team'
    });
  }

  async function createTestApplication(options?: {
    data: any;
  }): Promise<Result<Application | null>> {
    const data = {
      teamId: (await createTeam()).id,
      name: 'test application',
      environments: [{ name: 'staging' }]
    };

    return applicationRepository.createApplication(options ? options!.data : data);
  }

  describe('Configuration Creation', function () {
    it('should create configruations for an environment', async function () {
      const { data: application } = await createTestApplication();
      const { data: configurations } = await repository.updateConfigurations([{
        key: 'API_KEY',
        value: 'some secret api key',
        dataType: ConfigDataTypes.STRING,
        environmentId: application!.environments[0].id
      }]);

      expect(configurations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          key: 'API_KEY',
          value: 'some secret api key',
          dataType: 0,
          environment_id: application!.environments[0].id,
          secretPath: null
        })
      ]));
    });

    it('should update existing configurations', async function () {
      const { data: application } = await createTestApplication();
      // Given a key exists
      const { data: existing } = await repository.updateConfigurations([{
        key: 'API_KEY',
        value: 'some api key',
        dataType: ConfigDataTypes.STRING,
        environmentId: application!.environments[0].id
      }]);
      const { data: updated } = await repository.updateConfigurations([{
        key: 'API_KEY',
        value: 'updated',
        dataType: ConfigDataTypes.STRING,
        environmentId: application!.environments[0].id
      }, {
        key: 'API_SECRET',
        value: 'some secret',
        dataType: ConfigDataTypes.STRING,
        environmentId: application!.environments[0].id,
        secretPath: 'path/to/secret/store'
      }]);

      const allConfigs = await repository.find();
      expect(allConfigs).toHaveLength(2);

      const actualMergedRecord = updated!.find(c => c.key === 'API_KEY');
      const expectedMergedRecord = {
        id: existing![0].id,
        key: 'API_KEY',
        value: 'updated',
        created_at: existing![0].created_at
      };
      expect(actualMergedRecord).toEqual(expect.objectContaining(expectedMergedRecord));
    });

    it('should return error if key is empty', async function () {
      const { data: application } = await createTestApplication();
      const firstResult = await repository.updateConfigurations([{
        key: '',
        value: 'some secret',
        dataType: ConfigDataTypes.STRING,
        environmentId: application!.environments[0].id,
        secretPath: 'path/to/secret/store'
      }]);

      expect(firstResult.error?.message).toEqual('key is required');

      const secondResult = await repository.updateConfigurations([{
        key: '    ',
        value: 'some secret',
        dataType: ConfigDataTypes.STRING,
        environmentId: application!.environments[0].id,
        secretPath: 'path/to/secret/store'
      }]);

      expect(secondResult.error?.message).toEqual('key is required');
    });

    it('should return error if environment ID is empty', async function () {
      const firstResult = await repository.updateConfigurations([{
        key: 'some-key',
        value: 'some secret',
        dataType: ConfigDataTypes.STRING,
        environmentId: '',
        secretPath: 'path/to/secret/store'
      }]);

      expect(firstResult.error?.message).toEqual('environment ID is required');

      const secondResult = await repository.updateConfigurations([{
        key: 'some-key',
        value: 'some secret',
        dataType: ConfigDataTypes.STRING,
        environmentId: '  ',
        secretPath: 'path/to/secret/store'
      }]);

      expect(secondResult.error?.message)
        .toEqual('environment ID is required');
    });

    it('should return error if environment is not found', async function () {
      const result = await repository.updateConfigurations([{
        key: 'some-key',
        value: 'some secret',
        dataType: ConfigDataTypes.STRING,
        environmentId: 'some-env-id',
        secretPath: 'path/to/secret/store'
      }]);

      expect(result.error!.message)
        .toEqual('environment ID provided does not exist');
    });
  });
});

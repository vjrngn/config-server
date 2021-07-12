import { expect } from 'chai';
import { connect } from '../utils/utils';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { TeamRepository } from '../../src/repositories/team-repository';
import { Connection, getConnection } from 'typeorm';
import { BadInputException } from '../../src/repositories/exceptions/BadInputException';

describe('Team Repository', function () {
  let databaseConnection: Connection;
  let postgresContainer: StartedTestContainer;
  let repository: TeamRepository;

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
        repository = getConnection().getCustomRepository(TeamRepository);
      });
  });

  after(function () {
    return postgresContainer.stop().then(() => databaseConnection.close());
  });

  it('should create a team', function () {
    return repository
      .createTeam({
        name: 'some team'
      })
      .then((team) => {
        expect(team.id).to.not.equal('');
        expect(team.name).to.equal('some team');
      });
  });

  it('should throw error if name is blank', function () {
    return repository.createTeam({
      name: '   '
    }).catch(e => {
      expect(e).to.be.instanceOf(BadInputException);
    });
  });
});

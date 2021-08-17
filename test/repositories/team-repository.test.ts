import { expect } from 'chai';
// @ts-ignore
import { connect } from '../utils/utils';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { TeamRepository } from '../../src/repositories/team-repository';
import { Connection, getConnection } from 'typeorm';
import { BadInputException } from '../../src/repositories/exceptions/BadInputException';

describe('Team Repository', function () {
  let databaseConnection: Connection;
  let postgresContainer: StartedTestContainer;
  let repository: TeamRepository;

  before(async function () {
    const startedContainer = await new GenericContainer('postgres:13')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_USER', 'postgres')
      .withEnv('POSTGRES_PASSWORD', 'password')
      .withEnv('POSTGRES_DB', 'test')
      .start();
    postgresContainer = startedContainer;
    const connection = await connect(postgresContainer);
    databaseConnection = connection;
    await connection.runMigrations();
    repository = getConnection().getCustomRepository(TeamRepository);
  });

  after(async function () {
    await postgresContainer.stop();
    return await databaseConnection.close();
  });

  it('should create a team', async function () {
    const team = await repository.createTeam({
      name: 'some team'
    });
    expect(team.id).to.not.equal('');
    expect(team.name).to.equal('some team');
    expect(team.members).to.be.undefined;
  });

  it('should throw error if name is blank', async function () {
    try {
      await repository
        .createTeam({
          name: '   '
        });
    } catch (e) {
      expect(e).to.be.instanceOf(BadInputException);
    }
  });

  it('allows team members to be added during team creation', async function () {
    const team = await repository
      .createTeam({
        name: 'my team',
        members: ['user-id-1', 'user-id-2'],
      });
    const members = team.members.map((member) => {
      return {
        teamId: member.teamId,
        userId: member.userId
      };
    });
    const firstTeamMember = members.find(
      (member) => member.userId === 'user-id-1'
    );
    const secondTeamMember = members.find(
      (member) => member.userId === 'user-id-2'
    );
    expect(firstTeamMember).to.include({
      teamId: team.id,
      userId: 'user-id-1'
    });
    expect(secondTeamMember).to.include({
      teamId: team.id,
      userId: 'user-id-2'
    });
  });
});
